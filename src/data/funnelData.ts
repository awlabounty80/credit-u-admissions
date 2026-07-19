export interface CreditCard {
    id: string;
    name: string;
    benefits: string[];
    apr: string;
    annualFee: string;
    scoreRange: string;
    imageBg: string; // Tailwind gradient background classes
    minScore: number;
    maxScore: number;
}

export interface MockProfile {
    id: string;
    name: string;
    email: string;
    description: string;
    answers: {
        step1: {
            fullName: string;
            email: string;
            phone: string;
            state: string;
            housingStatus: string;
        };
        step2: {
            monthlyIncome: number;
            savingsBalance: number;
            estimatedScoreRange: string;
            totalDebt: number;
        };
        step3: {
            hasCollections: string;
            hasLatePayments: string;
            financialIdentity: string;
            biggestObstacle: string;
        };
        step4: {
            urgency: string;
            confidenceLevel: string;
            accountabilityPreference: string;
        };
    };
}

export const RECOMMENDED_CARDS: CreditCard[] = [
    {
        id: 'apex-gold',
        name: 'Credit U Apex Gold Card',
        benefits: [
            '2% cashback on all purchases, 4% on financial education resources',
            'Complimentary access to VIP university workshops and mastermind events',
            'Elite metal card design with zero liability protection',
            'No foreign transaction fees'
        ],
        apr: '0% Intro APR for 15 months, then 14.99% - 21.99% variable',
        annualFee: '$95 (Waived first year for Student Alumni)',
        scoreRange: 'Excellent (740 - 850)',
        imageBg: 'bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-950 text-white',
        minScore: 740,
        maxScore: 850
    },
    {
        id: 'legacy-rewards',
        name: 'Credit U Legacy Rewards Visa',
        benefits: [
            '1.5% cashback on all everyday purchases',
            'Double points on university bookstore items and course materials',
            'Free credit monitoring and identity protection tools',
            'No annual fee ever'
        ],
        apr: '16.99% - 24.99% variable APR',
        annualFee: '$0',
        scoreRange: 'Good (670 - 739)',
        imageBg: 'bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 text-white',
        minScore: 670,
        maxScore: 739
    },
    {
        id: 'builder-card',
        name: 'Credit U Builder Card',
        benefits: [
            'Credit limit increase review after 6 months of on-time payments',
            '1% cashback on all purchases deposited directly into savings',
            'Educational credit guidance via app notifications',
            'Reports to all three major bureaus to build credit fast'
        ],
        apr: '22.99% - 28.99% variable APR',
        annualFee: '$0',
        scoreRange: 'Fair (580 - 669)',
        imageBg: 'bg-gradient-to-br from-cyan-600 via-teal-800 to-zinc-950 text-white',
        minScore: 580,
        maxScore: 669
    },
    {
        id: 'pathway-secured',
        name: 'Credit U Pathway Secured Card',
        benefits: [
            'No credit check required to apply',
            'Credit limit matches your security deposit ($200 - $3,000)',
            'Path to upgrade to an unsecured Credit U card with good payment history',
            'Reports to all major bureaus to rebuild poor credit history'
        ],
        apr: '24.99% variable APR',
        annualFee: '$0',
        scoreRange: 'Poor (300 - 579)',
        imageBg: 'bg-gradient-to-br from-purple-700 via-pink-900 to-black text-white',
        minScore: 300,
        maxScore: 579
    }
];

export const MOCK_PROFILES: MockProfile[] = [
    {
        id: 'mock-1',
        name: 'Marcus Vance',
        email: 'marcus.vance@example.com',
        description: 'The Comeback Kid (Fair Credit - Building toward Homeownership)',
        answers: {
            step1: {
                fullName: 'Marcus Vance',
                email: 'marcus.vance@example.com',
                phone: '555-0199',
                state: 'GA',
                housingStatus: 'Rent'
            },
            step2: {
                monthlyIncome: 4500,
                savingsBalance: 1200,
                estimatedScoreRange: 'fair',
                totalDebt: 8500
            },
            step3: {
                hasCollections: 'yes',
                hasLatePayments: 'yes',
                financialIdentity: 'Rebuilder',
                biggestObstacle: 'Late payments & collections'
            },
            step4: {
                urgency: 'high',
                confidenceLevel: 'medium',
                accountabilityPreference: 'Daily check-ins'
            }
        }
    },
    {
        id: 'mock-2',
        name: 'Aaliyah Jackson',
        email: 'aaliyah.j@example.com',
        description: 'The Legacy Builder (Good Credit - Starting Business)',
        answers: {
            step1: {
                fullName: 'Aaliyah Jackson',
                email: 'aaliyah.j@example.com',
                phone: '555-0144',
                state: 'NC',
                housingStatus: 'Own'
            },
            step2: {
                monthlyIncome: 7800,
                savingsBalance: 14500,
                estimatedScoreRange: 'good',
                totalDebt: 3200
            },
            step3: {
                hasCollections: 'no',
                hasLatePayments: 'no',
                financialIdentity: 'Legacy Builder',
                biggestObstacle: 'Lack of business credit knowledge'
            },
            step4: {
                urgency: 'medium',
                confidenceLevel: 'high',
                accountabilityPreference: 'Weekly coaching'
            }
        }
    },
    {
        id: 'mock-3',
        name: 'David Jenkins',
        email: 'd.jenkins@example.com',
        description: 'The Survivor (Poor Credit - High Debt & collections)',
        answers: {
            step1: {
                fullName: 'David Jenkins',
                email: 'd.jenkins@example.com',
                phone: '555-0122',
                state: 'TX',
                housingStatus: 'Live With Family'
            },
            step2: {
                monthlyIncome: 2800,
                savingsBalance: 150,
                estimatedScoreRange: 'poor',
                totalDebt: 18400
            },
            step3: {
                hasCollections: 'yes',
                hasLatePayments: 'yes',
                financialIdentity: 'Survivor',
                biggestObstacle: 'High monthly payments & collectors'
            },
            step4: {
                urgency: 'high',
                confidenceLevel: 'low',
                accountabilityPreference: 'Intense accountability partner'
            }
        }
    }
];
