import { describe, it, expect } from 'vitest';
import {
  instanceSettings,
  auditLogs,
  instanceSettingsRelations,
  auditLogsRelations,
} from '../admin';
import {
  updateInstanceSettingSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  resolveReportSchema,
} from '../validators';

describe('instanceSettings table', () => {
  it('should export table with expected columns', () => {
    expect(instanceSettings).toBeDefined();
    const cols = Object.keys(instanceSettings);
    expect(cols).toContain('id');
    expect(cols).toContain('key');
    expect(cols).toContain('value');
    expect(cols).toContain('updatedBy');
    expect(cols).toContain('updatedAt');
  });
});

describe('auditLogs table', () => {
  it('should export table with expected columns', () => {
    expect(auditLogs).toBeDefined();
    const cols = Object.keys(auditLogs);
    expect(cols).toContain('id');
    expect(cols).toContain('userId');
    expect(cols).toContain('action');
    expect(cols).toContain('targetType');
    expect(cols).toContain('targetId');
    expect(cols).toContain('metadata');
    expect(cols).toContain('ipAddress');
    expect(cols).toContain('createdAt');
  });
});

describe('admin relations', () => {
  it('should export all relation definitions', () => {
    expect(instanceSettingsRelations).toBeDefined();
    expect(auditLogsRelations).toBeDefined();
  });
});

describe('updateInstanceSettingSchema', () => {
  it('should accept valid setting', () => {
    expect(updateInstanceSettingSchema.safeParse({ key: 'theme.default', value: 'deepwood' }).success).toBe(true);
  });

  it('should accept any value type', () => {
    expect(updateInstanceSettingSchema.safeParse({ key: 'some.bool', value: true }).success).toBe(true);
    expect(updateInstanceSettingSchema.safeParse({ key: 'some.num', value: 42 }).success).toBe(true);
    expect(updateInstanceSettingSchema.safeParse({ key: 'some.obj', value: { nested: true } }).success).toBe(true);
  });

  it('should reject empty key', () => {
    expect(updateInstanceSettingSchema.safeParse({ key: '', value: 'x' }).success).toBe(false);
  });

  it('should reject key over 128 chars', () => {
    expect(updateInstanceSettingSchema.safeParse({ key: 'a'.repeat(129), value: 'x' }).success).toBe(false);
  });
});

describe('updateUserRoleSchema', () => {
  it('should accept valid role change', () => {
    const result = updateUserRoleSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      role: 'staff',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid role', () => {
    const result = updateUserRoleSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      role: 'superadmin',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid UUID', () => {
    expect(updateUserRoleSchema.safeParse({ userId: 'not-a-uuid', role: 'admin' }).success).toBe(false);
  });
});

describe('updateUserStatusSchema', () => {
  it('should accept valid status change', () => {
    const result = updateUserStatusSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      status: 'suspended',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid status', () => {
    const result = updateUserStatusSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      status: 'banned',
    });
    expect(result.success).toBe(false);
  });
});

describe('resolveReportSchema', () => {
  it('should accept valid resolution', () => {
    const result = resolveReportSchema.safeParse({
      reportId: '550e8400-e29b-41d4-a716-446655440000',
      status: 'resolved',
      resolution: 'Content was removed as it violated community guidelines.',
    });
    expect(result.success).toBe(true);
  });

  it('should accept dismissed status', () => {
    const result = resolveReportSchema.safeParse({
      reportId: '550e8400-e29b-41d4-a716-446655440000',
      status: 'dismissed',
      resolution: 'Report was reviewed and found to be without merit.',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty resolution', () => {
    const result = resolveReportSchema.safeParse({
      reportId: '550e8400-e29b-41d4-a716-446655440000',
      status: 'resolved',
      resolution: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject resolution over 2000 chars', () => {
    const result = resolveReportSchema.safeParse({
      reportId: '550e8400-e29b-41d4-a716-446655440000',
      status: 'resolved',
      resolution: 'a'.repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
