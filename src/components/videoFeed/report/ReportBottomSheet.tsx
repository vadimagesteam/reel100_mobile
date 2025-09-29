import { ReportSheet } from '../../reportSheet/ReportSheet';
import { useVideoFeed } from '../hooks';

export const ReportBottomSheet = () => {
  const report = useVideoFeed((s) => s.report);
  const closeReport = useVideoFeed((s) => s.actions.closeReport);

  if (!report) {
    return null;
  }

  return (
    <ReportSheet userId={report.userId} videoId={report.videoId} open onDismiss={closeReport} />
  );
};
