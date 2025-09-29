import { toast } from '@backpackapp-io/react-native-toast';
import BottomSheet, { BottomSheetTextInput, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from '@react-native-vector-icons/ionicons';
import clsx from 'clsx';
import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Text, View, TouchableOpacity } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { z } from 'zod';
import { Button } from '../ui';
import { bottomSheetStyles } from '../ui/bottomSheet/styles';
import { useBottomSheetBackdrop } from '../ui/bottomSheet/useBottomSheetBackdrop';
import { FormInput, FormItem } from '../ui/form';
import { useCreateReportMutation } from './hooks/useCreateReportMutation';

const Schema = z.object({
  reason: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    {
      error: 'Please select a reason for reporting.',
    },
  ),
  content: z.string().max(1000),
});

type FormData = z.infer<typeof Schema>;

export type ProfileReportSheetProps = {
  open: boolean;
  onDismiss: () => void;
  userId: string;
  videoId?: string;
};

const reportReasons = [
  { label: 'Racism', value: 'racism' },
  { label: 'Hate Speech', value: 'hateSpeech' },
  { label: 'Nudity', value: 'nudity' },
  { label: 'Violence', value: 'violence' },
  { label: 'Bullying', value: 'bullying' },
  { label: 'Spam', value: 'spam' },
  { label: 'Illegal', value: 'illegal' },
];

export const ReportSheet = (props: ProfileReportSheetProps) => {
  const { onDismiss } = props;
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(Schema),
  });

  const createReport = useCreateReportMutation();

  const onSubmit = async (data: FormData) => {
    await createReport.mutateAsync({
      reason: data.reason.label,
      description: data.content,
      userId: props.userId,
      videoId: props.videoId,
    });
    ReactNativeHapticFeedback.trigger(HapticFeedbackTypes.notificationSuccess);
    toast.success('Report has been sent. Thank you!');
    onDismiss();
  };

  useEffect(() => {
    ReactNativeHapticFeedback.trigger(HapticFeedbackTypes.soft);
  }, []);

  const snapPoints = useMemo(() => ['75%'], []);

  const backdrop = useBottomSheetBackdrop();

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      topInset={insets.top}
      enablePanDownToClose
      onClose={onDismiss}
      handleIndicatorStyle={bottomSheetStyles.handleIndicatorStyle}
      backgroundStyle={bottomSheetStyles.backgroundStyle}
      style={bottomSheetStyles.bottomSheetStyle}
      backdropComponent={backdrop}
      keyboardBlurBehavior="restore"
    >
      <BottomSheetScrollView contentContainerClassName="flex-1 flex-col gap-4 p-[20px]">
        <View className="flex-col gap-1">
          <Text className="text-center text-xl font-bold text-primary">Report</Text>
        </View>

        <Controller
          control={control}
          name="reason"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormItem error={error} requiredMark label="Reason">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="h-[50px] flex-row items-center justify-between rounded-xl border-2 border-black5 px-[16px]"
                  >
                    <Text
                      numberOfLines={2}
                      className={clsx(
                        'max-w-[80%]',
                        value ? 'font-semibold text-primary' : 'text-muted',
                      )}
                    >
                      {value ? value.label : 'Select reason'}
                    </Text>
                    <Ionicons name="chevron-down-outline" size={20} color="gray" />
                  </TouchableOpacity>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {/* @ts-expect-error https://github.com/nandorojo/zeego/issues/98 */}
                  <DropdownMenu.Label>Select reason</DropdownMenu.Label>
                  {reportReasons?.map((option) => (
                    // @ts-expect-error https://github.com/nandorojo/zeego/issues/98
                    <DropdownMenu.CheckboxItem
                      checked={false}
                      value={option.value === value?.value}
                      textValue={option.label}
                      onValueChange={() => {
                        onChange(option);
                      }}
                      key={option.value.toString()}
                    />
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </FormItem>
          )}
        />

        <FormInput
          control={control}
          name="content"
          label="Description"
          placeholder="Provide description (optional)"
          multiline
          numberOfLines={4}
          InputComponent={BottomSheetTextInput}
        />

        <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
