// Predefined colors for the first 20 processes
const predefinedColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FFCD56',
  '#4BC0C0',
  '#36A2EB',
  '#FF6384',
  '#9966FF',
  '#FF9F40',
  '#FFCE56',
  '#36A2EB',
  '#4BC0C0',
  '#FF6384',
  '#9966FF',
  '#FF9F40',
  '#FFCD56',
  '#36A2EB'
]

const randomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const getColor = (index: number): string => {
  return index < predefinedColors.length ? predefinedColors[index] : randomColor()
}
