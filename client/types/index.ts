export interface Profile {
    id: string
    firstName: string
    lastName: string
    gender: 'Male' | 'Female'
    dateOfBirth: string
    age: number
    height: number
    city: string
    country: string
    email: string
    phone: string
    college: string
    degree: string
    company: string
    designation: string
    income: number
    maritalStatus: 'Single' | 'Divorced' | 'Widowed'
    religion: string
    caste: string
    languages: string[]
    siblings: number
    wantKids: 'Yes' | 'No' | 'Maybe'
    openToRelocate: 'Yes' | 'No' | 'Maybe'
    openToPets: 'Yes' | 'No' | 'Maybe'
    status: 'Active' | 'On Hold' | 'Matched' | 'Match Sent'
    notes: string
}

export interface MatchResult {
    profile: Profile   
    score: number
    label: string
    reason: string
    aiGenerated: boolean
}

export interface AuthResponse {
    token: string,
    user: {
        username: string,
        name: string,
        role: string
    }
}
