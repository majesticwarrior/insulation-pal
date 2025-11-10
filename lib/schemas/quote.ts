import * as z from 'zod'

export const quoteSchema = z.object({
  homeSize: z.string().min(1, 'Home size is required'),
  areas: z.array(z.string()).min(1, 'Please select at least one area'),
  insulationTypes: z.array(z.string()).min(1, 'Please select at least one insulation type'),
  additionalServices: z.array(z.string()).optional(),
  ceilingFanCount: z.string().optional(),
  projectType: z.enum(['residential', 'commercial']).optional(),
  atticInsulationDepth: z.string().optional(),
  quotePreference: z.enum(['random_three', 'choose_three']),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Email address is required'),
  customerPhone: z
    .string()
    .min(10, 'Phone number is required and must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required and must be at least 5 digits')
})

export type QuoteFormData = z.infer<typeof quoteSchema>

