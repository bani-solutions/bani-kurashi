// Pure three-way merge: retain independent edits from another device.
const fields = ['name', 'type', 'done', 'due'];
const clone = value => JSON.parse(JSON.stringify(value));
export function validateItems(items) {
  if (!Array.isArray(items) || items.length > 1000) throw new Error('invalid-list');
  const ids = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || !item.id || item.id.length > 200 ||
        ids.has(item.id) || !['shopping', 'todo'].includes(item.type) ||
        typeof item.name !== 'string' || !item.name.trim() || item.name.length > 1000 ||
        typeof item.done !== 'boolean' ||
        (item.due != null && typeof item.due !== 'string')) throw new Error('invalid-item');
    ids.add(item.id);
  }
  return items;
}
export function mergeChanges(remote, before, after) {
  [remote, before, after].forEach(validateItems);
  const base = new Map(before.map(item => [item.id, item]));
  const desired = new Map(after.map(item => [item.id, item]));
  const merged = new Map(remote.map(item => [item.id, clone(item)]));
  const conflicts = [];
  // Explicit deletes win over edits; an edit never resurrects a remote deletion.
  for (const id of base.keys()) if (!desired.has(id)) merged.delete(id);
  for (const next of after) {
    const old = base.get(next.id), current = merged.get(next.id);
    if (!old) {
      if (!current) merged.set(next.id, clone(next));
      else if (JSON.stringify(current) !== JSON.stringify(next)) conflicts.push(next.id);
    } else if (!current) {
      if (fields.some(field => (old[field] ?? '') !== (next[field] ?? ''))) conflicts.push(next.id);
    } else {
      for (const field of fields) {
        if ((old[field] ?? '') !== (next[field] ?? '')) {
          if (next[field] === undefined) delete current[field];
          else current[field] = next[field];
        }
      }
    }
  }
  let order = remote.map(item => item.id).filter(id => merged.has(id));
  // Only reorder IDs whose relative order this device actually changed.
  const common = new Set(before.filter(item => desired.has(item.id)).map(item => item.id));
  const oldOrder = before.filter(item => common.has(item.id)).map(item => item.id);
  const newOrder = after.filter(item => common.has(item.id)).map(item => item.id);
  if (oldOrder.join('\0') !== newOrder.join('\0')) {
    const remaining = newOrder.filter(id => merged.has(id));
    let index = 0;
    order = order.map(id => common.has(id) ? remaining[index++] : id);
  }
  // Place new/undo-restored items beside local anchors, retaining remote-only items.
  for (let i = 0; i < after.length; i++) {
    const id = after[i].id;
    if (!merged.has(id) || order.includes(id)) continue;
    const next = after.slice(i + 1).find(item => order.includes(item.id));
    if (next) order.splice(order.indexOf(next.id), 0, id);
    else order.push(id);
  }
  const items = order.map(id => merged.get(id));
  validateItems(items);
  return { items, conflicts };
}
