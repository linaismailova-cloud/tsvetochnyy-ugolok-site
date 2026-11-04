import {language,t} from './i18n.js?v=20261017-12';
// UI translations only. Product names, descriptions and customer quotes stay verbatim.
export const catalogTranslations = {
 'КАТАЛОГ · 160 ПОЗИЦИЙ':'KATALOG · 160 TA MAHSULOT',
 'Найдите своё растение.':'O‘zingizga mos o‘simlikni toping.',
 'Фото, описания и цены из ассортимента магазина. Сверено 4 ноября 2026 года. Это подборка предложений, а не остатки в реальном времени.':'Suratlar, tavsiflar va narxlar do‘kon assortimentidan olingan. Ma’lumotlar 2026-yil 4-noyabrda tekshirilgan. Bu takliflar to‘plami, real vaqtdagi ombor qoldiqlari emas.',
 'Наличие, точный экземпляр, состав комплекта и итоговую стоимость подтвердим до заказа.':'Mavjudlik, aniq o‘simlik, to‘plam tarkibi va yakuniy narxni buyurtmadan oldin tasdiqlaymiz.',
 'Названия, описания и новые сведения представлены на языке источника: русский.':'O‘simlik nomlari va tavsiflari manba tilida, rus tilida berilgan.',
 'Поиск по названию':'Nomi bo‘yicha qidirish',
 'Например, антуриум':'Ruscha nomini kiriting',
 'Цена до':'Eng yuqori narx', 'Любая':'Istalgan', 'Порядок':'Tartib',
 'Как в подборке':'To‘plamdagi tartib', 'Сначала новые':'Avval yangilari',
 'По возрастанию цены':'Narx o‘sishi bo‘yicha', 'Сбросить':'Tozalash',
 'В фильтре по цене не показаны позиции с несколькими ценами или неуказанной стоимостью.':'Narx filtri bir nechta narxi bor yoki narxi ko‘rsatilmagan mahsulotlarni ko‘rsatmaydi.',
 'Ничего не найдено.':'Hech narsa topilmadi.',
 'Попробуйте другое название или сбросьте фильтры. Поможем подобрать растение лично.':'Boshqa nomni kiriting yoki filtrlarni tozalang. O‘simlik tanlashga yordam beramiz.',
 'Наличие уточняется':'Mavjudlik aniqlashtiriladi',
 'Наличие уточняется · Есть уточнения':'Mavjudlik aniqlashtiriladi · Tafsilotlarni aniqlashtirish kerak',
 'Подробнее и заказать ↗':'Batafsil va buyurtma ↗',
 'Цена и комплектация требуют уточнения':'Narx va to‘plam tarkibini aniqlashtirish kerak',
 'Цена по запросу':'Narx so‘rov bo‘yicha',
 'В публикации несколько цен или вариантов. Состав и итоговую цену подтвердим перед заказом.':'E’londa bir nechta narx yoki variant bor. To‘plam tarkibi va yakuniy narxni buyurtmadan oldin tasdiqlaymiz.',
 'Размер в исходной публикации неоднозначен. Уточните высоту конкретного растения.':'Asl e’londagi o‘lcham aniq emas. Tanlangan o‘simlikning bo‘yini aniqlashtiring.',
 'Доступно фото-превью. Более подробное фото можно запросить перед заказом.':'Suratning kichik nusxasi mavjud. Buyurtmadan oldin batafsilroq surat so‘rashingiz mumkin.',
 'Данные требуют уточнения.':'Ma’lumotlarni aniqlashtirish kerak.',
 'Подтвердим перед заказом':'Buyurtmadan oldin tasdiqlaymiz',
 'Уточним наличие, размер, кашпо и доставку. Цена в публикации может измениться. Открытие Telegram не отправляет сообщение и не оформляет заказ.':'Mavjudlik, o‘lcham, bezak tuvagi va yetkazishni aniqlashtiramiz. E’londagi narx o‘zgarishi mumkin. Telegramni ochish xabar yubormaydi va buyurtmani rasmiylashtirmaydi.',
 'Уточнить и заказать ↗':'Aniqlashtirish va buyurtma ↗',
 'Отзывы и фотографии покупателей':'Xaridorlarning fikrlari va suratlari',
 'РАСТЕНИЯ В ИНТЕРЬЕРЕ':'INTERYERDAGI O‘SIMLIKLAR', 'ПОСЛЕ ПОКУПКИ':'XARIDDAN KEYIN',
 'Живые детали':'Tirik detallar', 'на своих местах.':'o‘z joyida.',
 'Зелёные истории':'Xaridorlarimizning', 'наших покупателей.':'yashil hikoyalari.',
 'Фотографии покупателей из раздела отзывов. Это не кейс озеленения под ключ.':'Fikrlar bo‘limidan xaridorlarning suratlari. Bu to‘liq ko‘kalamzorlashtirish loyihasi emas.',
 'Отзывы из сообщества магазина. Цитаты сохранены на языке оригинала, без имён и контактов.':'Do‘kon hamjamiyatidagi fikrlar. Iqtiboslar asl tilida, ismlar va aloqa ma’lumotlarisiz saqlangan.',
 'Растение на фотографии покупателя':'Xaridor suratidagi o‘simlik',
};
export function catalogText(value,target=language){
 if(target!=='uz')return value;
 const key=value.trim();let translated=catalogTranslations[key];
 if(translated===undefined&&/^\d[\d\s\u00a0]* сум$/.test(key))translated=key.replace('сум','so‘m');
 if(translated===undefined&&key.startsWith('Фото покупателя · '))translated=key.replace('Фото покупателя','Xaridor surati');
 if(translated===undefined&&key.startsWith('Публикация: '))translated=key.replace('Публикация:','E’lon:').replace('Данные сверены 04.11.2026. Наличие не подтверждено.','Ma’lumotlar 04.11.2026 kuni tekshirilgan. Mavjudlik tasdiqlanmagan.');
 return translated===undefined?t(value,target):value.replace(key,translated);
}
export function localizeCatalog(root){
 if(language!=='uz')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){const n=walker.currentNode;if(!n.parentElement.closest('[data-source-copy]'))n.textContent=catalogText(n.textContent);}
 for(const e of root.querySelectorAll('[aria-label],[placeholder],[alt]')){
  if(e.closest('[data-source-copy]'))continue;
  for(const a of ['aria-label','placeholder','alt'])if(e.hasAttribute(a))e.setAttribute(a,catalogText(e.getAttribute(a)));
 }
}
