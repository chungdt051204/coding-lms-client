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
  formatPrice: ({ price }) => {
    return Intl.NumberFormat("vi-VN").format(price);
  },
};
