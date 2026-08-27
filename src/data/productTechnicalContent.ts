export interface ProductTechnicalContent {
  overview: string[]
  features?: string[]
  technical?: Array<{ label: string; value: string }>
  safety?: string
}

export const productTechnicalContent: Record<string, ProductTechnicalContent> = {
  'bt01-bodyfiller': {
    overview: ['BT01 Body Filler is a 2K multifiller with excellent filling properties, easy sanding and a smooth finish for levelling imperfections in automotive and industrial applications.'],
    technical: [{ label: 'Suitable substrates', value: 'Aluminium, stainless steel, galvanised steel, bare metal and polyester' }, { label: 'Compliance', value: 'VOC compliant' }],
  },
  'upvc-2k-binder-561-topcoat-4l': {
    overview: ['UPVC 2K Binder 561 is a two-component topcoat based on an acrylic binder and isocyanate hardener. It offers fast drying with good chemical and mechanical resistance.'],
    technical: [{ label: 'Suitable substrates', value: 'PVCu, GRP, polyester, powder-coated and anodized aluminium, stainless steel, durable plastics, cast iron, steel, galvanized and phosphated steel, composite doors and glass' }],
  },
  'upvc-1k-binder-731-topcoat-4-25l': {
    overview: ['TULDA UPVC 1K Topcoat is a one-component coating formulated for superior adhesion on hard and flexible plastic surfaces, including UPVC, Foamex board and flexible PVC materials.'],
    features: ['Enhanced adhesion on hard and flexible plastic surfaces', 'Suitable for revitalising worn cladding and fascia boards', 'Compatible with UPVC windows', 'Fast-drying formulation'],
  },
  'xct100-clearcoat-21-vhs-extra-speed-clear': {
    overview: ['Two-component, VOC-compliant acrylic clearcoat with extremely fast oven and air drying. Its long open time supports painting a large number of elements and complete cars.'],
    features: ['High gloss, hardness and scratch resistance', 'Polishable after 3 hours at 20°C or 5 minutes at 60°C'],
  },
  'ct50-21-uni-ecoclear-2k-clear-coat-1-5l-7-5l-kit': {
    overview: ['2+1 UNI ECOCLEAR is a two-part universal acrylic clearcoat with rapid curing and easy application. It offers UV and weather resistance, good scratch resistance, outstanding flow and a high-gloss finish.'],
    technical: [{ label: 'Polishing', value: 'After 4 hours at 20°C or 30 minutes at a minimum of 60°C, after cooling' }],
  },
  'tulda-paper-strips-70x420-14h-all-grits-box-of-50': {
    overview: ['Paper sanding strips (70 × 420 mm) with 14 holes for sanding all surfaces. Long lasting, efficient and easy to use.'],
    features: ['Aluminium oxide abrasive', 'Double resin bonded on C paper backing', 'Long life and low heat during sanding', 'Designed to help prevent clogging'],
    technical: [{ label: 'Applications', value: 'Wood, metal, composites and automotive materials' }, { label: 'Available grits', value: 'P40, P60, P80, P120, P180, P240, P320' }],
  },
  'tulda-paper-strips-70-198': {
    overview: ['Paper sanding strips (70 × 198 mm) with 8 holes for sanding all surfaces. Long lasting, efficient and easy to use.'],
    features: ['Aluminium oxide abrasive', 'Double resin bonded on C paper backing', 'Long life and low heat during sanding', 'Designed to help prevent clogging'],
    technical: [{ label: 'Applications', value: 'Wood, metal, composites and automotive materials' }, { label: 'Available grits', value: 'P40, P60, P80, P120, P180, P240, P320' }],
  },
  'tulda-6-150mm-15h-sanding-paper-disc-all-grits-box-of-100': {
    overview: ['150 mm sanding paper discs with 15 holes for sanding all surfaces. Long lasting, efficient and easy to use, with a Velcro attachment.'],
    technical: [{ label: 'Available grits', value: 'P60, P80, P120, P180, P240, P320, P800' }, { label: 'Pack size', value: '100 discs' }],
  },
  'tulda-st10': {
    overview: ['2K universal acrylic thinner suitable for the dilution of metallic, pearl and non-metallic basecoats, polyurethane varnishes, acrylic paints, varnishes and primers.'],
    technical: [{ label: 'Packaging', value: '1 litre and 5 litre sizes' }],
  },
  'tulda-pt30-multiprimer': {
    overview: ['HS Acrylic Primer / Filler 4+1 is a filling primer based on acrylic resins. Its high spray viscosity allows thick layers to repair scratches and substrate irregularities.'],
    features: ['Excellent adhesion', 'Easy to sand', 'Built-in guide coat', 'High flexibility and impact resistance'],
    technical: [{ label: 'Mixing ratio', value: '4:1' }, { label: 'Drying', value: '20 minutes at 60°C; 2 hours at 20°C' }, { label: 'VOC content', value: '< 540 g/l' }, { label: 'Substrates', value: 'Old paint coatings, polyester putties, steel, aluminium, stainless steel, wash primers, epoxy primers, plastics and polyester laminates' }, { label: 'Colours / packaging', value: 'White, grey and black; 1.5 L and 5 L kits with hardener' }],
  },
  'tulda-6-150mm-15h-sanding-film-discs-all-grits': {
    overview: ['150 mm film discs with 15 holes for sanding all surfaces. A popular option for long life and cut, with a Velcro attachment.'],
    technical: [{ label: 'Available grits', value: 'P240, P500, P800, P1000, P1200, P1500, P2000' }, { label: 'Pack size', value: '50 discs' }],
  },
  'tulda-xpt20-hs-rapid-primer-5l-kit-2k-acrylic-fast-air-dry': {
    overview: ['Multi-purpose two-pack fast-drying primer with strong filling power and adhesion between coats. It can be used for rapid repair, medium-area repair and complete resprays.'],
    features: ['Air dry and ready to sand after 20 minutes at 25°C', 'Easy to apply and sand', 'High build', 'Excellent flexibility', 'Suitable for rapid, standard and overall repairs, including wet-on-wet process for new parts'],
    safety: 'May cause skin irritation, allergic skin reaction and serious eye damage. Use PPE, handle with care and refer to the Safety Data Sheet.',
  },
  'tulda-st11-acrylic-thinner-slow-1l': {
    overview: ['Slow acrylic thinner for metallic, pearl and non-metallic basecoats, polyurethane varnishes, acrylic paints, varnishes and primers.'],
    safety: 'May cause skin irritation, allergic skin reaction and serious eye damage. Use PPE, handle with care and refer to the Safety Data Sheet.',
  },
  'tulda-ct90-vhs-speedline-acrylic-clearcoat-1l': {
    overview: ['CT90 VHS is a very-high-solids two-component acrylic clearcoat with low VOC content and a short curing time. It is UV resistant with excellent flow and a high-gloss finish.'],
    features: ['VOC compliant: < 420 g/l', 'Fast drying: 10 minutes at 50°C', 'Very high solids', 'Excellent scratch resistance', 'High UV protection', 'Suitable for all repair sizes'],
    technical: [{ label: 'Mixing ratio', value: '2:1' }, { label: 'Packaging', value: '7.5 litre and 1.5 litre kits' }],
    safety: 'May cause skin irritation, allergic skin reaction and serious eye damage. Use PPE, handle with care and refer to the Safety Data Sheet.',
  },
  'tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l': {
    overview: ['CT60 HS is a high-solids two-component acrylic clearcoat with low VOC content and a short curing time. It is resistant to UV rays and weather conditions, with good scratch resistance, excellent flow and a high-gloss finish.'],
    features: ['Fast drying: 15 minutes at 60°C', 'High solids', 'Excellent scratch resistance', 'High UV protection', 'Suitable for all repair sizes'],
    technical: [{ label: 'Mixing ratio', value: '2:1' }, { label: 'Kit contents', value: 'CT60 Clearcoat 5 L + HT60 Hardener 2.5 L' }, { label: 'Packaging', value: '7.5 litre and 1.5 litre kits' }],
  },
}
