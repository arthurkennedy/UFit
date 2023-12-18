export const convertMetersToInches = (meters) => meters * 39.3701
export const convertMetersToFeetAndInches = (meters) => {
	const totalInches = convertMetersToInches(meters)
	const feet = Math.floor(totalInches / 12)
	const inches = Math.round(totalInches % 12)

	return {
		feet,
		inches
	}
}
export const calculateBMI = (weightInPounds, heightInInches) => (weightInPounds / (heightInInches * heightInInches)) * 703
export const convertFeetAndInchesToMeters = (feet, inches) => (feet * .3048) + (inches * 0.0252) // convert to meters