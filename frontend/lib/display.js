// В реальных данных из Supabase нет отдельного поля "тип иконки" или "цвет
// подложки" — эти вещи мы в макетах рисовали вручную для тестовых товаров.
// Чтобы карточки на сайте не были одинаковыми серыми прямоугольниками,
// подбираем иконку по названию категории и цвет — по порядку в списке.
// TODO: когда захотите — можно добавить в таблицу products настоящее поле
// "icon_type", чтобы не гадать по названию категории.

export function getIconType(categoryName = '') {
  const name = categoryName.toLowerCase();
  if (name.includes('короб')) return 'box';
  if (name.includes('вакуум')) return 'vacuum';
  if (name.includes('бренд')) return 'branded';
  return 'bag';
}

const BG_PALETTE = ['var(--mint-pale)', '#F1F3F3', '#FDE9E5'];

export function getBg(index = 0) {
  return BG_PALETTE[index % BG_PALETTE.length];
}
