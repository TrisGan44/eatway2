import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

type BaseFieldProps = {
  label: string
  helperText?: string
  stretch?: boolean
}

interface SelectFieldProps extends BaseFieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  type: 'select'
  options: { label: string; value: string }[]
}

interface TextareaFieldProps extends BaseFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: 'textarea'
}

interface InputFieldProps extends BaseFieldProps, InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
}

export type FormFieldProps = SelectFieldProps | TextareaFieldProps | InputFieldProps

export default function FormField(props: FormFieldProps) {
  const { label, helperText, stretch } = props
  let control: ReactNode

  if (props.type === 'textarea') {
    const { type: _type, label: _label, helperText: _helper, stretch: _stretch, ...textareaProps } = props
    control = <textarea {...(textareaProps as TextareaFieldProps)} />
  } else if (props.type === 'select') {
    const { type: _type, label: _label, helperText: _helper, stretch: _stretch, options, ...selectProps } = props
    control = (
      <select {...(selectProps as SelectFieldProps)}>
        <option value=''>Pilih</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  } else {
    const { type = 'text', label: _label, helperText: _helper, stretch: _stretch, ...inputProps } = props
    control = <input type={type} {...(inputProps as InputFieldProps)} />
  }

  return (
    <label className={`form-field ${stretch ? 'form-field--stretch' : ''}`}>
      <span className='form-field__label'>{label}</span>
      {control}
      {helperText && <small className='form-field__helper'>{helperText}</small>}
    </label>
  )
}
