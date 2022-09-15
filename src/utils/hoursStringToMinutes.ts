export function hoursStringToMinutes(hours: string) {
  const [hour, minutes] = hours.split(':').map(Number)
  return (hour * 60) + minutes
}