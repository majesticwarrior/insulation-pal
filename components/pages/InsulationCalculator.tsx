'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

type Area = 'Attic' | 'Walls' | 'Basement' | 'Crawl Space' | 'Garage' | 'Floor'

// Simple state → climate zone mapping
const STATE_TO_ZONE: Record<string, number> = {
  AL: 3, AK: 7, AZ: 2, AR: 3, CA: 3, CO: 5, CT: 5,
  DE: 4, FL: 2, GA: 3, HI: 1, ID: 5, IL: 5, IN: 5,
  IA: 6, KS: 4, KY: 4, LA: 2, ME: 6, MD: 4, MA: 5,
  MI: 6, MN: 7, MS: 3, MO: 4, MT: 6, NE: 5, NV: 3,
  NH: 6, NJ: 4, NM: 4, NY: 5, NC: 3, ND: 7, OH: 5,
  OK: 3, OR: 4, PA: 5, RI: 5, SC: 3, SD: 6, TN: 4,
  TX: 2, UT: 5, VT: 6, VA: 4, WA: 4, WV: 5, WI: 6,
  WY: 6, DC: 4,
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]

const suggestRValue = (zone: number, area: Area): number => {
  const byArea: Record<Area, number[]> = {
    Attic:   [0, 30, 38, 49, 49, 60, 60, 60],
    Walls:   [0, 13, 13, 13, 19, 19, 21, 21],
    Basement:[0, 5, 5, 10, 10, 15, 15, 15],
    'Crawl Space': [0, 5, 10, 13, 13, 19, 19, 19],
    Garage:  [0, 0, 0, 13, 13, 13, 19, 19],
    Floor:   [0, 13, 19, 25, 25, 30, 30, 30],
  }
  const clamped = Math.max(1, Math.min(7, zone))
  return byArea[area][clamped] || 0
}

type TypeKey = 'fiberglass_batts' | 'blown_in_cellulose' | 'spray_foam' | 'foam_board' | 'rigid_foam'

const AREA_TO_TYPES: Record<Area, TypeKey[]> = {
  Attic: ['blown_in_cellulose','fiberglass_batts','spray_foam'],
  Walls: ['fiberglass_batts','blown_in_cellulose','spray_foam'],
  Basement: ['foam_board','fiberglass_batts','spray_foam'],
  'Crawl Space': ['rigid_foam','fiberglass_batts','spray_foam'],
  Garage: ['fiberglass_batts','foam_board','spray_foam'],
  Floor: ['fiberglass_batts','spray_foam'],
}

const MATERIAL_PRICING: Record<TypeKey, number> = {
  fiberglass_batts: 1.25,
  blown_in_cellulose: 1.10,
  spray_foam: 3.50,
  foam_board: 2.80,
  rigid_foam: 2.60,
}

const LABOR_PRICING: Record<Area, number> = {
  Attic: 1.00,
  Walls: 1.50,
  Basement: 1.75,
  'Crawl Space': 2.00,
  Garage: 1.20,
  Floor: 1.40,
}

const getLaborRate = (area: Area, type: TypeKey): number => {
  const baseRate = LABOR_PRICING[area]
  return type === 'fiberglass_batts' ? 1.50 : baseRate
}

export default function InsulationCalculator() {
  const [sqft, setSqft] = useState<number | ''>('')
  const [area, setArea] = useState<Area>('Attic')
  const [state, setState] = useState<string>('AZ')
  const zone = useMemo(() => STATE_TO_ZONE[state] ?? 3, [state])
  const [rValue, setRValue] = useState<number>(() => suggestRValue(STATE_TO_ZONE['AZ'], 'Attic'))
  const availableTypes = AREA_TO_TYPES[area]
  const [type, setType] = useState<TypeKey>(availableTypes[0])

  useMemo(() => {
    setRValue((prev) => prev || suggestRValue(zone, area))
  }, [zone, area])

  useMemo(() => {
    if (!availableTypes.includes(type)) setType(availableTypes[0])
  }, [area, availableTypes, type])

  const results = useMemo(() => {
    const validSqft = typeof sqft === 'number' && isFinite(sqft) && sqft > 0 ? sqft : 0
    const materialRate = MATERIAL_PRICING[type] || 0
    const laborRate = getLaborRate(area, type)
    const diy = validSqft * materialRate
    const installed = diy + validSqft * laborRate
    return { diy, installed, materialRate, laborRate }
  }, [sqft, type, area])

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-[#0a4768] mb-6">Calculate Your Insulation Needs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sqft">Square Footage</Label>
              <Input 
                id="sqft" 
                inputMode="numeric" 
                value={sqft} 
                onChange={(e) => setSqft(e.target.value === '' ? '' : Number(e.target.value))} 
                placeholder="e.g., 2000" 
                className="text-lg"
              />
            </div>
            
            <div>
              <Label>Area to Insulate</Label>
              <Select value={area} onValueChange={(v) => setArea(v as Area)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(['Attic','Walls','Basement','Crawl Space','Garage','Floor'] as Area[]).map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">Climate Zone: {zone}</p>
            </div>
            
            <div>
              <Label htmlFor="rvalue">Target R-Value</Label>
              <Input 
                id="rvalue" 
                inputMode="numeric" 
                value={rValue} 
                onChange={(e) => setRValue(Number(e.target.value) || 0)} 
              />
              <p className="text-xs text-gray-500 mt-1">Suggested: R{suggestRValue(zone, area)} for {area}</p>
            </div>
            
            <div>
              <Label>Insulation Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as TypeKey)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableTypes.map((t) => (
                      <SelectItem key={t} value={t}>{
                        t === 'fiberglass_batts' ? 'Fiberglass Batts' :
                        t === 'blown_in_cellulose' ? 'Blown-in Cellulose' :
                        t === 'spray_foam' ? 'Spray Foam' :
                        t === 'foam_board' ? 'Foam Board' :
                        t === 'rigid_foam' ? 'Rigid Foam' : t
                      }</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#0a4768] mb-3">Estimate Breakdown</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>Average Material Rate</span>
                  <span className="font-medium">${results.materialRate.toFixed(2)}/sq ft</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Average Labor Rate</span>
                  <span className="font-medium">${results.laborRate.toFixed(2)}/sq ft</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Square Footage</span>
                  <span className="font-medium">{typeof sqft === 'number' ? sqft : 0} sq ft</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#D8E1FF] border-[#0a4768]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#0a4768] mb-3">Total Estimates</h3>
                <div className="flex justify-between font-bold text-lg text-[#0a4768] mb-2">
                  <span>DIY Price (Materials)</span>
                  <span>${results.diy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#0a4768]">
                  <span>Installed Price</span>
                  <span>${results.installed.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-xs text-gray-500">Estimates only. Actual costs vary by brand, thickness, access, and local rates.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

