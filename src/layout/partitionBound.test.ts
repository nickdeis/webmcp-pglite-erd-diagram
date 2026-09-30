import { describe, expect, it } from 'vitest'
import { formatBound } from './partitionBound'

describe('formatBound', () => {
  it('drops the prefix and midnight timestamps of range bounds', () => {
    expect(
      formatBound("FOR VALUES FROM ('2025-01-01 00:00:00-07') TO ('2026-01-01 00:00:00+00')"),
    ).toBe("FROM ('2025-01-01') TO ('2026-01-01')")
  })

  it('keeps meaningful times and other bound kinds', () => {
    expect(formatBound("FOR VALUES FROM ('2025-01-01 12:30:00') TO (MAXVALUE)")).toBe(
      "FROM ('2025-01-01 12:30:00') TO (MAXVALUE)",
    )
    expect(formatBound("FOR VALUES IN ('eu', 'us')")).toBe("IN ('eu', 'us')")
    expect(formatBound('FOR VALUES WITH (modulus 4, remainder 1)')).toBe(
      'WITH (modulus 4, remainder 1)',
    )
    expect(formatBound('DEFAULT')).toBe('DEFAULT')
  })
})
