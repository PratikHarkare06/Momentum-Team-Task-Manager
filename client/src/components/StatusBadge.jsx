import React from 'react';

const STATUS_CONFIG = {
  'todo': { label: 'To Do', cls: 'badge-todo' },
  'in-progress': { label: 'In Progress', cls: 'badge-in-progress' },
  'completed': { label: 'Completed', cls: 'badge-completed' },
  'blocked': { label: 'Blocked', cls: 'badge-blocked' },
  'active': { label: 'Active', cls: 'badge-active' },
  'on-hold': { label: 'On Hold', cls: 'badge-on-hold' },
};

const PRIORITY_CONFIG = {
  'low': { label: 'Low', cls: 'badge-low' },
  'medium': { label: 'Medium', cls: 'badge-medium' },
  'high': { label: 'High', cls: 'badge-high' },
  'critical': { label: 'Critical', cls: 'badge-critical' },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, cls: 'badge-todo' };
  return <span className={`badge ${config.cls}`}>{config.label}</span>;
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || { label: priority, cls: 'badge-low' };
  return <span className={`badge ${config.cls}`}>{config.label}</span>;
}

export function RoleBadge({ role }) {
  return <span className={`badge badge-${role}`}>{role}</span>;
}
