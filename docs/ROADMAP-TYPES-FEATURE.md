# Roadmap Types Feature

## Overview
The Questions module includes a roadmap categorization system that enables teams to classify and track questions, issues, and initiatives based on their priority and status.

## Roadmap Type Options

| Type | Value | Purpose | Use Case |
|------|-------|---------|----------|
| **None** | `none` | Default state | General questions, informational requests |
| **Blocker** | `blocker` | Critical issues | Items preventing project progress |
| **FYI** | `fyi` | Informational | Items for awareness, no action required |
| **In Progress** | `in_progress` | Active work | Questions/issues currently being worked on |

## Features

### Admin UI Integration
- Roadmap type appears as a dropdown in the question creation/edit forms
- List view displays roadmap type as a sortable/filterable column
- Default value is "None" for new questions

### Department-Level Tracking
- Roadmap types are scoped to departments for organizational isolation
- Teams can track their own progress without cross-department interference
- Supports enterprise-level reporting and analytics

### Workflow Benefits
- **Project Managers**: Clear visibility into blockers and work-in-progress items
- **Team Members**: Easy identification of priority items requiring attention
- **Leadership**: High-level view of organizational question/issue status

## Implementation Details

### Database Schema
```typescript
roadmapType: select({
  type: 'enum',
  options: [
    { label: 'None', value: 'none' },
    { label: 'Blocker', value: 'blocker' },
    { label: 'FYI', value: 'fyi' },
    { label: 'In Progress', value: 'in_progress' },
  ],
  defaultValue: 'none',
}),
```

### Access Control
- All authenticated users can view roadmap types
- Question creation/editing follows existing question permissions
- Department-level filtering applies to roadmap type visibility

## Usage Examples

### For Development Teams
- Mark technical debt questions as "FYI"
- Flag deployment blockers as "Blocker"
- Track feature development questions as "In Progress"

### For Marketing Teams
- Campaign planning questions marked "In Progress"
- Brand compliance issues flagged as "Blocker"
- Industry updates shared as "FYI"

### For Leadership
- Strategic initiative questions marked "In Progress"
- Policy clarifications shared as "FYI"
- Resource allocation blockers flagged appropriately

## Analytics & Reporting

The roadmap types enable:
- Status distribution reports across departments
- Blocker identification and resolution tracking
- Work-in-progress monitoring and capacity planning
- Historical trend analysis of question types

## Future Enhancements

Potential extensions to the roadmap type system:
- Custom roadmap types per department
- Automated status transitions based on question lifecycle
- Integration with external project management tools
- Advanced analytics and reporting dashboards

---

*Feature implemented: [Current Date]*  
*Documentation version: 1.0*