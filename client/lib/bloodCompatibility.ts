const compatibilityMap: Record<string, { canDonateTo: string[]; canReceiveFrom: string[] }> = {
  "O-": {
    canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-"],
  },
  "O+": {
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O-", "O+"],
  },
  "A-": {
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
    canReceiveFrom: ["O-", "A-"],
  },
  "A+": {
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+"],
  },
  "B-": {
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-", "B-"],
  },
  "B+": {
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["O-", "O+", "B-", "B+"],
  },
  "AB-": {
    canDonateTo: ["AB-", "AB+"],
    canReceiveFrom: ["O-", "A-", "B-", "AB-"],
  },
  "AB+": {
    canDonateTo: ["AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  },
};


export function getCompatibleRecipients(bloodType: string): string[] {
  return compatibilityMap[bloodType]?.canDonateTo || [];
}

export function getCompatibleDonors(bloodType: string): string[] {
  return compatibilityMap[bloodType]?.canReceiveFrom || [];
}