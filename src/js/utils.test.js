import { describe, it, expect } from 'vitest';
import { filterTasksByStatus, filterCommentsByTask, validateNewTask } from './utils.js';

describe('filterTasksByStatus', () => {
  const tasks = [
    { id: 1, title: 'A', status: 'todo' },
    { id: 2, title: 'B', status: 'doing' },
    { id: 3, title: 'C', status: 'done' },
    { id: 4, title: 'D', status: 'todo' }
  ];
  it('filtra por status todo', () => {
    expect(filterTasksByStatus(tasks, 'todo')).toEqual([tasks[0], tasks[3]]);
  });
  it('devuelve [] si no hay tareas con ese status', () => {
    expect(filterTasksByStatus(tasks, 'inexistente')).toEqual([]);
    expect(filterTasksByStatus([], 'todo')).toEqual([]);
  });
});

describe('filterCommentsByTask', () => {
  const comments = [
    { id: 1, taskId: 1 },
    { id: 2, taskId: '1' },
    { id: 3, taskId: 2 }
  ];
  it('concatena id numérico y string iguales', () => {
    expect(filterCommentsByTask(comments, 1)).toEqual([comments[0], comments[1]]);
    expect(filterCommentsByTask(comments, '1')).toEqual([comments[0], comments[1]]);
  });
  it('devuelve [] si no hay comentarios de la tarea', () => {
    expect(filterCommentsByTask(comments, 999)).toEqual([]);
  });
});

describe('validateNewTask', () => {
  it('título vacío o solo espacios es inválido', () => {
    expect(validateNewTask({ title: '' }).isValid).toBe(false);
    expect(validateNewTask({ title: '   ' }).isValid).toBe(false);
    expect(validateNewTask({}).isValid).toBe(false);
  });
  it('título válido pasa y se recorta', () => {
    const r = validateNewTask({ title: '  Comprar leche  ' });
    expect(r.isValid).toBe(true);
    expect(r.task.title).toBe('Comprar leche');
  });
});