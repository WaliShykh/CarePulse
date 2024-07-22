'use client'
import { E164Number } from "libphonenumber-js/core";

import React from 'react'
import Image from "next/image";

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import DatePicker from 'react-datepicker';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
  import { Control } from 'react-hook-form'
import { FormFieldType } from './forms/PatientForm'

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType
    name: string,
    label? : string,
    placeholder? : string,
    iconSrc? : string,
    iconAlt? : string,
    disabled? : boolean,
    dateFormat? : string,
    showTimeSelect? : boolean,
    children? : React.ReactNode,
    renderSkeleton? : (field: any) => React.ReactNode,
}

const RenderField = ({field, props}: { field: any; props: CustomProps}) => {
    const { fieldType , iconSrc, iconAlt, placeholder } = props;
    switch(fieldType) {
        case FormFieldType.INPUT:
            return(
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    {iconSrc && (
                        <Image
                            src ={iconSrc}
                            width={24}
                            height={24}
                            alt={iconAlt || 'icon'}
                            className='ml-2'
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder= {placeholder}
                            {...field}
                            className='shad-input border-0'
                        />
                    </FormControl>
                </div>
            )

        case FormFieldType.PHONE_INPUT:
            return(
                <FormControl>
                    <PhoneInput 
                        defaultCountry='PK'
                        placeholder = {placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className='input-phone'
                    />
                </FormControl>
            )
        case FormFieldType.DATE_PICKER:
            return(
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image 
                    src='/assets/icons/calendar.svg'
                    height={24}
                    width={24}
                    alt="calendar" 
                    className="ml-2"/>

                    <FormControl> 
                        <DatePicker selected={field.value}
                        onChange={(date) => field.onChange(date)} />
                    </FormControl>
                </div>
            )
        
            default:
                break;
    }

} 

const CustomFormField = (props: CustomProps) => {
    const { control , fieldType , name , label } = props;
  return (
    <FormField
    control={control}
    name={ name }
    render={({ field }) => (
      <FormItem className='flex-1'>
        {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
        )}

            <RenderField  field = {field} props = {props} /> 

            <FormMessage className='shad-error' />
        </FormItem>
    )}
  />
  )
}

export default CustomFormField