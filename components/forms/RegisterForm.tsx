"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import SubmitButton from "@/components/SubmitButton"
import { registerPatient } from "@/lib/actions/patient.actions";
import {
  Form,
  FormControl,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import CustomFormField from "@/components/CustomFormField"
import { PatientFormValidation } from "@/lib/validation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { SelectItem } from "@/components/ui/select";
import FileUploader from "@/components/FileUploader";
 
const RegisterForm = ( { user }: { user: User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: PatientFormDefaultValues,
  });


  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    console.log("Form submitted", values);
    setIsLoading(true);
  
    let formData;
  
    if(values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })
  
      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append ('fileName', values.identificationDocument[0].name)
    }
  
    try {
      console.log('Preparing to register patient');
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }
      console.log('Patient data prepared', patientData);
      // @ts-ignore
      const patient = await registerPatient(patientData);
  
      if(patient) {
        console.log("Patient registered successfully", patient);
        router.push(`/patients/${user.$id}/new-appointment`);
      } else {
        console.error("Failed to register patient");
      }
  
    } catch (error) {
      console.error("Error registering patient:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="space-y-12 flex-1">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-6">
            <div className="mb-9 space-y-6">
                <h2 className="sub-header">Personal Information</h2>
            </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">

            <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            />

            <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(92) 123-456789"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of birth"
            />

            <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => (
                    <FormControl>
                        <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange}
                        defaultValue={field.value}>
                            {GenderOptions.map((option) => (
                                <div key={option} className="radio-group">
                                    <RadioGroupItem value={option} id = {option} />
                                    <Label htmlFor={option} className="cursor-pointer">{ option }</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}          
            />            
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="14th Street DHA 6, Lahore"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder="Software Engineer"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency contact name"
                placeholder="Guardian's name"
            />

            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency contact number"
                placeholder="(92) 123-456789"
            />
        </div>

        <section className="space-y-6">
            <div className="mb-9 space-y-6">
                <h2 className="sub-header">Medical Information</h2>
            </div>
        </section>

        <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary Physician"
                placeholder="Select a Physician"
            >
           {Doctors.map((doctor) => (<SelectItem key= {doctor.name} value={ doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                    <Image src={doctor.image}  height={32} width={32} alt={doctor.name} 
                    className="rounded-full border-dark-500"/>
                    <p>{doctor.name}</p>
                </div>
           </SelectItem>))}
        </CustomFormField>


        <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider" // This is likely the problem
                label="Insurance Provider"
                placeholder="Jublee Insurance, AdamJee..."
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Insaurance policy number"
                placeholder="ABC123456789"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="allergies"
                label="Allergies (if any)"
                placeholder="Pollen, Peanuts, Dust"
            />
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedication"
                label="Current medication (if any)"
                placeholder="Paracetamol, Loprin (500 mg), Motiget(10 mg)"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                label="Family medical history (if any)"
                placeholder="Father had heart diesease, Mother had Asthama"
            />
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Past medication (if any)"
                placeholder="cancer, heart disease, hypertension, diabetes"
            />
        </div>


        <section className="space-y-6">
            <div className="mb-9 space-y-6">
                <h2 className="sub-header">Identification and Verification</h2>
            </div>
        </section>

        <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                label="Identification type"
                placeholder="Select a identification type"
            >
           {IdentificationTypes.map((type) => (<SelectItem key={type} value={type}>
            {type}
           </SelectItem>))}
        </CustomFormField>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification number"
            placeholder="Ex: 123456789"
        />

            <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="identificationDocument"
                label="Scanned copy of identification document"
                renderSkeleton={(field) => (
                   <FormControl>
                        <FileUploader files= {field.value} onChange={field.onChange} />
                   </FormControl>
                )}          
            />        

        <section className="space-y-6">
            <div className="mb-9 space-y-6">
                <h2 className="sub-header">Consent and Privacy</h2>
            </div>
        </section>

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to treatment"
        />

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to disclosure of information"
        />

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I consent to privacy policy"
        />

<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
  </form>
</Form>
  )
}
export default RegisterForm