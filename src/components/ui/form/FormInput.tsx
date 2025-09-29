import clsx from 'clsx';
import { Controller, type FieldPathValue } from 'react-hook-form';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { Input, InputProps } from '../Input';
import { FormItem, FormItemProps } from './FormItem';

export type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Pick<ControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'> &
  Omit<FormItemProps, 'children'> &
  InputProps & {
    formatValue?: (value: FieldPathValue<TFieldValues, TName>) => string;
  };

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  requiredMark,
  placeholder,
  viewProps,
  name,
  control,
  numberOfLines,
  formatValue,
  ...inputProps
}: FormInputProps<TFieldValues, TName>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormItem viewProps={viewProps} requiredMark={requiredMark} label={label} error={error}>
        <Input
          {...inputProps}
          testID={`input-${name}`}
          numberOfLines={numberOfLines}
          className={clsx('bg-transparent', numberOfLines ? 'rounded-2xl' : 'rounded-[60px]')}
          style={numberOfLines ? { height: numberOfLines * 26 } : undefined}
          placeholder={placeholder}
          onChangeText={onChange}
          value={formatValue ? formatValue(value as FieldPathValue<TFieldValues, TName>) : value}
        />
      </FormItem>
    )}
  />
);
