import { supabase } from '../lib/supabase'
import bcrypt from 'bcryptjs'

const testContractors = [
  {
    email: 'admin@arizonapremier.com',
    password: 'AZPremier2024!',
    business_name: 'Arizona Premier Insulation',
    established_date: '2015-03-15',
    county: 'Maricopa',
    license_number: 'AZ-INS-001234',
    bbb_accredited: true,
    phone: '(602) 555-0101',
    about: 'Arizona Premier Insulation has been serving Phoenix homeowners for over 8 years with top-quality insulation services. We specialize in energy-efficient solutions that reduce costs and improve comfort.',
    lead_preference: 'both',
    exclusive_leads_interested: true,
    status: 'approved',
    credits: 50,
    services: ['attic', 'wall', 'crawl_space'],
    insulation_types: ['blown_in', 'spray_foam', 'roll_batt'],
    service_areas: ['Phoenix', 'Scottsdale', 'Tempe', 'Mesa']
  },
  {
    email: 'info@desertshield.com',
    password: 'DesertShield2024!',
    business_name: 'Desert Shield Insulation',
    established_date: '2018-07-22',
    county: 'Maricopa',
    license_number: 'AZ-INS-002345',
    bbb_accredited: true,
    phone: '(602) 555-0202',
    about: 'Desert Shield Insulation brings innovative insulation solutions to Phoenix homes. Our expert team focuses on spray foam applications and comprehensive energy audits.',
    lead_preference: 'email',
    exclusive_leads_interested: false,
    status: 'approved',
    credits: 35,
    services: ['attic', 'basement', 'garage'],
    insulation_types: ['spray_foam', 'foam_board', 'radiant_barrier'],
    service_areas: ['Phoenix', 'Scottsdale', 'Paradise Valley']
  },
  {
    email: 'contact@valleycomfort.com',
    password: 'ValleyComfort2024!',
    business_name: 'Valley Comfort Solutions',
    established_date: '2012-01-10',
    county: 'Maricopa',
    license_number: 'AZ-INS-003456',
    bbb_accredited: false,
    phone: '(602) 555-0303',
    about: 'Valley Comfort Solutions is Phoenix\'s most trusted insulation contractor, with over 11 years of experience helping homeowners reduce energy costs and improve home comfort.',
    lead_preference: 'both',
    exclusive_leads_interested: true,
    status: 'approved',
    credits: 75,
    services: ['attic', 'wall', 'basement'],
    insulation_types: ['blown_in', 'roll_batt', 'spray_foam'],
    service_areas: ['Phoenix', 'Mesa', 'Chandler', 'Gilbert', 'Tempe']
  },
  {
    email: 'team@cactusinsulation.com',
    password: 'CactusIns2024!',
    business_name: 'Cactus Insulation Pros',
    established_date: '2019-09-05',
    county: 'Maricopa',
    license_number: 'AZ-INS-004567',
    bbb_accredited: true,
    phone: '(602) 555-0404',
    about: 'Cactus Insulation Pros specializes in residential insulation with a focus on customer satisfaction and energy efficiency. Family-owned and operated in Phoenix.',
    lead_preference: 'text',
    exclusive_leads_interested: false,
    status: 'approved',
    credits: 25,
    services: ['attic', 'garage', 'crawl_space'],
    insulation_types: ['spray_foam', 'blown_in'],
    service_areas: ['Phoenix', 'Chandler', 'Ahwatukee']
  },
  {
    email: 'hello@swenergysavers.com',
    password: 'SWEnergy2024!',
    business_name: 'Southwest Energy Savers',
    established_date: '2020-04-18',
    county: 'Maricopa',
    license_number: 'AZ-INS-005678',
    bbb_accredited: false,
    phone: '(602) 555-0505',
    about: 'Southwest Energy Savers is committed to helping Phoenix residents achieve maximum energy efficiency through professional insulation installation and upgrades.',
    lead_preference: 'email',
    exclusive_leads_interested: true,
    status: 'approved',
    credits: 40,
    services: ['wall', 'basement', 'attic'],
    insulation_types: ['blown_in', 'foam_board', 'roll_batt'],
    service_areas: ['Phoenix', 'Tempe', 'Scottsdale']
  },
  {
    email: 'info@grandcanyoninsulation.com',
    password: 'GrandCanyon2024!',
    business_name: 'Grand Canyon Insulation',
    established_date: '2017-11-30',
    county: 'Maricopa',
    license_number: 'AZ-INS-006789',
    bbb_accredited: true,
    phone: '(602) 555-0606',
    about: 'Grand Canyon Insulation provides comprehensive insulation services throughout the Phoenix metro area. We pride ourselves on quality workmanship and excellent customer service.',
    lead_preference: 'both',
    exclusive_leads_interested: false,
    status: 'approved',
    credits: 60,
    services: ['attic', 'crawl_space', 'wall'],
    insulation_types: ['roll_batt', 'blown_in'],
    service_areas: ['Phoenix', 'Glendale', 'Peoria', 'Surprise']
  },
  {
    email: 'support@arizonacomfort.com',
    password: 'AZComfort2024!',
    business_name: 'Arizona Comfort Control',
    established_date: '2021-06-12',
    county: 'Maricopa',
    license_number: 'AZ-INS-007890',
    bbb_accredited: false,
    phone: '(602) 555-0707',
    about: 'Arizona Comfort Control is a newer company with experienced technicians focused on providing modern insulation solutions for Phoenix area homes.',
    lead_preference: 'text',
    exclusive_leads_interested: true,
    status: 'approved',
    credits: 20,
    services: ['attic', 'wall', 'garage'],
    insulation_types: ['blown_in', 'spray_foam'],
    service_areas: ['Phoenix', 'Surprise', 'Sun City']
  }
]

export async function createTestContractors() {
  console.log('Creating test contractors...')
  
  for (const contractor of testContractors) {
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(contractor.password, 12)
      
      // Insert contractor
      const { data: newContractor, error: contractorError } = await supabase
        .from('contractors')
        .insert({
          email: contractor.email,
          password_hash: passwordHash,
          business_name: contractor.business_name,
          established_date: contractor.established_date,
          county: contractor.county,
          license_number: contractor.license_number,
          bbb_accredited: contractor.bbb_accredited,
          phone: contractor.phone,
          about: contractor.about,
          lead_preference: contractor.lead_preference as any,
          exclusive_leads_interested: contractor.exclusive_leads_interested,
          status: contractor.status as any,
          credits: contractor.credits
        })
        .select()
        .single()

      if (contractorError) {
        console.error(`Error creating contractor ${contractor.business_name}:`, contractorError)
        continue
      }

      console.log(`Created contractor: ${contractor.business_name}`)

      // Insert services
      const serviceInserts = contractor.services.map(service => ({
        contractor_id: newContractor.id,
        service_type: service as any
      }))
      
      if (serviceInserts.length > 0) {
        const { error: servicesError } = await supabase
          .from('contractor_services')
          .insert(serviceInserts)
        
        if (servicesError) {
          console.error(`Error inserting services for ${contractor.business_name}:`, servicesError)
        }
      }

      // Insert insulation types
      const insulationInserts = contractor.insulation_types.map(type => ({
        contractor_id: newContractor.id,
        insulation_type: type as any
      }))
      
      if (insulationInserts.length > 0) {
        const { error: insulationError } = await supabase
          .from('contractor_insulation_types')
          .insert(insulationInserts)
        
        if (insulationError) {
          console.error(`Error inserting insulation types for ${contractor.business_name}:`, insulationError)
        }
      }

      // Insert service areas
      const areaInserts = contractor.service_areas.map(area => ({
        contractor_id: newContractor.id,
        city: area
      }))
      
      if (areaInserts.length > 0) {
        const { error: areasError } = await supabase
          .from('contractor_service_areas')
          .insert(areaInserts)
        
        if (areasError) {
          console.error(`Error inserting service areas for ${contractor.business_name}:`, areasError)
        }
      }

      // Add some sample reviews
      const sampleReviews = [
        {
          contractor_id: newContractor.id,
          customer_name: 'John Smith',
          customer_email: 'john@example.com',
          rating: 5,
          comment: `Excellent work by ${contractor.business_name}! Very professional and the insulation has already made a difference in our energy bills.`,
          verified: true
        },
        {
          contractor_id: newContractor.id,
          customer_name: 'Sarah Johnson',
          customer_email: 'sarah@example.com',
          rating: 4,
          comment: `Good quality work and fair pricing. Would recommend ${contractor.business_name} to others.`,
          verified: true
        }
      ]

      const { error: reviewsError } = await supabase
        .from('reviews')
        .insert(sampleReviews)

      if (reviewsError) {
        console.error(`Error inserting reviews for ${contractor.business_name}:`, reviewsError)
      }

    } catch (error) {
      console.error(`Error processing contractor ${contractor.business_name}:`, error)
    }
  }
  
  console.log('Finished creating test contractors')
  return testContractors
}

// Export login credentials for testing
export const testCredentials = testContractors.map(contractor => ({
  business_name: contractor.business_name,
  email: contractor.email,
  password: contractor.password
}))

console.log('Test Contractor Login Credentials:')
console.log('=====================================')
testCredentials.forEach((cred, index) => {
  console.log(`${index + 1}. ${cred.business_name}`)
  console.log(`   Email: ${cred.email}`)
  console.log(`   Password: ${cred.password}`)
  console.log('')
})
