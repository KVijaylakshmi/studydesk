export function taskInput(body) {
  const { title, subject, description = '', dueDate, priority = 'Medium', status = 'To do' } = body;
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) throw new Error('Enter a task title (1–120 characters).');
  if (typeof subject !== 'string' || !subject.trim() || subject.trim().length > 60) throw new Error('Enter a subject (1–60 characters).');
  if (typeof description !== 'string' || description.length > 1000) throw new Error('Description must be under 1000 characters.');
  if (typeof dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || Number.isNaN(Date.parse(dueDate)) || new Date(dueDate).toISOString().slice(0, 10) !== dueDate) throw new Error('Enter a valid due date.');
  if (!['Low', 'Medium', 'High'].includes(priority) || !['To do', 'In progress', 'Completed'].includes(status)) throw new Error('Choose a valid priority and status.');
  return { title: title.trim(), subject: subject.trim(), description, dueDate, priority, status };
}
