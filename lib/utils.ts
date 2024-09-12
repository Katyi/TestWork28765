export function formatDate(today: Date) {
  let date = today.toJSON().slice(0, 10);
  let formattedDate =
    date.slice(8, 10) + '.' + date.slice(5, 7) + '.' + date.slice(0, 4);

  return formattedDate;
}

export function getDate(dt: number) {
  let date = new Date(dt * 1000);
  let month = (date.getMonth() + 1).toString();
  if (month.length === 1) {
    month = 0 + month;
  }
  let formattedDate = date.getDate() + '.' + month + '.' + date.getFullYear();
  return formattedDate;
}

export function getTime(dt: number) {
  let time = new Date(dt * 1000);

  let hours = time.getHours().toString();
  let minutes = time.getMinutes().toString();
  let seconds = time.getSeconds().toString();

  if (hours.length === 1) hours = 0 + hours;
  if (minutes.length === 1) minutes = 0 + minutes;
  if (seconds.length === 1) seconds = 0 + seconds;

  let formattedTime = hours + ':' + minutes + ':' + seconds;
  return formattedTime;
}
