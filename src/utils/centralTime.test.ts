import { centralDayRangeUtc, toStartOfDayInCentralTime } from './centralTime';

// These assertions are on absolute UTC instants, so they hold regardless of the
// timezone the test runner happens to be in (CI here runs in EEST).
describe('centralDayRangeUtc', () => {
  it('windows the Central calendar day during CDT (summer, UTC-5)', () => {
    // 2026-06-16T02:37:00Z == 21:37 on Jun 15 in Central (CDT) => Central day Jun 15.
    const range = centralDayRangeUtc(new Date('2026-06-16T02:37:00Z'));
    expect(range.gte).toBe('2026-06-15T05:00:00.000Z'); // midnight CDT
    expect(range.lte).toBe('2026-06-16T04:59:59.999Z'); // 23:59:59.999 CDT
  });

  it('windows the Central calendar day during CST (winter, UTC-6)', () => {
    // 2026-01-15T12:00:00Z == 06:00 on Jan 15 in Central (CST) => Central day Jan 15.
    const range = centralDayRangeUtc(new Date('2026-01-15T12:00:00Z'));
    expect(range.gte).toBe('2026-01-15T06:00:00.000Z'); // midnight CST
    expect(range.lte).toBe('2026-01-16T05:59:59.999Z');
  });

  it('includes a video that is still in the active Central cycle but "yesterday" for a Pacific user (the reported bug)', () => {
    // Client in Pacific (PDT, UTC-7), local clock ~7:37 PM Jun 15 => 02:37Z Jun 16.
    const now = new Date('2026-06-16T02:37:00Z');
    // Video uploaded ~20h earlier: 06:37Z Jun 15. In Central that is 01:37 Jun 15
    // (today's cycle); in Pacific local time it is 23:37 on Jun 14 (yesterday).
    const videoCreatedAt = new Date('2026-06-15T06:37:00.000Z');

    const { gte, lte } = centralDayRangeUtc(now);
    expect(videoCreatedAt.getTime()).toBeGreaterThanOrEqual(new Date(gte).getTime());
    expect(videoCreatedAt.getTime()).toBeLessThanOrEqual(new Date(lte).getTime());

    // The old local-timezone window (PDT midnight = 07:00Z Jun 15) would have
    // excluded it — confirming this fix is what brings the #1 video back.
    const localPdtMidnight = new Date('2026-06-15T07:00:00.000Z');
    expect(videoCreatedAt.getTime()).toBeLessThan(localPdtMidnight.getTime());
  });

  it('toStartOfDayInCentralTime is midnight Central for the instant', () => {
    const start = toStartOfDayInCentralTime(new Date('2026-06-16T02:37:00Z'));
    const centralClock = start.toLocaleTimeString('en-US', {
      timeZone: 'America/Chicago',
      hour12: false,
    });
    expect(centralClock).toBe('00:00:00');
  });
});
