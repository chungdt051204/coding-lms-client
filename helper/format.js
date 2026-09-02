export const format = {
  formatDate: ({ date }) => {
    const d = new Date(date);
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  },
  formatDateTime: ({ date }) => {
    const d = new Date(date);
    return `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(
      2,
      "0"
    )}`;
  },
  formatSecondToTime: ({ second }) => {
    if (second < 60) return `00:${String(second).padStart(2, "0")}`;
    if (second >= 60 && second < 3600)
      return `${String(Math.floor(second / 60)).padStart(2, "0")}:${String(
        second % 60
      ).padStart(2, "0")}`;
    if (second >= 3600)
      return `${String(Math.floor(second / 3600)).padStart(2, "0")}:${String(
        Math.floor((second % 3600) / 60)
      ).padStart(2, "0")}:${String((second % 3600) % 60).padStart(2, "0")}`;
  },
  formatPrice: ({ price }) => {
    return Intl.NumberFormat("vi-VN").format(price);
  },
};
