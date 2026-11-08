import {localizeCatalog, catalogText} from './catalog-i18n.js';
import {products, reviews} from './catalog-data.js';
import {t, language, updateLanguageLinks} from './i18n.js?v=20261017-12';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' сум';
export const priceLabel = p => p.review.includes('multiple_prices_or_variants') ? 'Цена и комплектация требуют уточнения' : p.price == null ? 'Цена по запросу' : money(p.price);
export const reviewNotes = p => p.review.filter(flag => flag !== 'low_resolution_preview').map(flag => ({multiple_prices_or_variants:'В публикации несколько цен или вариантов. Состав и итоговую цену подтвердим перед заказом.', ambiguous_dimensions_in_source:'Размер в исходной публикации неоднозначен. Уточните высоту конкретного растения.'}[flag] || 'Данные требуют уточнения.'));
export function selectProducts({category='all',query='',budget='',sort='source'}={}) {
  const needle=query.trim().toLocaleLowerCase('ru');
  let result=products.filter(p=>(category==='all'||p.tags.includes(category))&&(!needle||(p.name+' '+p.description).toLocaleLowerCase('ru').includes(needle))&&(!budget||(p.price!=null&&!p.review.includes('multiple_prices_or_variants')&&p.price<=Number(budget))));
  if(sort==='price')result.sort((a,b)=>(a.review.includes('multiple_prices_or_variants')?Infinity:a.price??Infinity)-(b.review.includes('multiple_prices_or_variants')?Infinity:b.price??Infinity));
  if(sort==='new')result.sort((a,b)=>b.date.localeCompare(a.date));
  return result;
}
function productImage(p){return `<img src="${p.image}" alt="${esc(p.name)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async">`;}
function card(p){return `<article class="plant-card source-product"><button class="plant-image-button" data-catalog-product="${p.id}" aria-label="Подробнее: ${esc(p.name)}">${productImage(p)}<span class="image-open">↗</span></button><div class="plant-card-title"><h3 data-source-copy lang="ru"><button data-catalog-product="${p.id}">${esc(p.name)}</button></h3></div><p class="source-price">${priceLabel(p)}</p><p class="source-status">Наличие уточняется${p.review.length?' · Есть уточнения':''}</p><button class="plant-price" data-catalog-product="${p.id}">Подробнее и заказать ↗</button></article>`;}
export function initCatalog(){
 const section=document.querySelector('#catalog');if(!section)return;
 section.innerHTML=`<div id="gift-intro" class="gift-intro" hidden><h2>${t('Подарок с продолжением.')}</h2><p>${t('Подберём растение под ваш бюджет и условия получателя. Кашпо, упаковку и состав подарка согласуем отдельно.')}</p><a href="#gift-builder" class="text-link">${t('Подобрать подарок')} ↗</a></div><div class="catalog-heading"><p class="eyebrow">КАТАЛОГ · 160 ПОЗИЦИЙ</p><h2>Найдите своё растение.</h2><p>Фото, описания и цены из ассортимента магазина. Сверено 4 ноября 2026 года. Это подборка предложений, а не остатки в реальном времени.</p><p class="catalog-source-note">Наличие, точный экземпляр, состав комплекта и итоговую стоимость подтвердим до заказа.${language==='uz'?' <span>Названия, описания и новые сведения представлены на языке источника: русский.</span>':''}</p></div><div class="catalog-toolbar"><div class="filter-list" role="group" aria-label="${t('Подборки растений')}">${[['all','Все растения'],['flowering','Цветущие'],['large','Крупные'],['planter','В авторских кашпо']].map(([id,label])=>`<button data-filter="${id}" aria-pressed="false">${t(label)}</button>`).join('')}</div></div><form class="catalog-controls" role="search"><label>Поиск по названию<input type="search" name="query" placeholder="Например, антуриум" maxlength="100"></label><label>Цена до<select name="budget"><option value="">Любая</option value="100000">100 000 сум</option><option value="200000">200 000 сум</option><option value="500000">500 000 сум</option><option value="1000000">1 000 000 сум</option></select></label><label>Порядок<select name="sort"><option value="source">Как в подборке</option><option value="new">Сначала новые</option><option value="price">По возрастанию цены</option></select></label><button type="reset" class="text-link">Сбросить</button></form><p class="catalog-budget-note" hidden>В фильтре по цене не показаны позиции с несколькими ценами или неуказанной стоимостью.</p><p id="catalog-count" aria-live="polite"></p><div class="catalog-grid" id="plant-grid"></div><div id="catalog-empty" class="catalog-empty" hidden><h3>Ничего не найдено.</h3><p>Попробуйте другое название или сбросьте фильтры. Поможем подобрать растение лично.</p></div><p class="catalog-note">${t('Фотографии растений — из материалов магазина. Актуальные цены, наличие и состав комплекта подтвердит Рана.')}</p>`;
 const form=section.querySelector('form'), params=new URLSearchParams(location.search);
 let category=['all','flowering','large','planter'].includes(params.get('category'))?params.get('category'):'all';
 let scenario=params.get('mode')==='gift'?'gift':'self';
 form.elements.query.value=params.get('q')||'';
 form.elements.budget.value=['100000','200000','500000','1000000'].includes(params.get('budget'))?params.get('budget'):'';
 form.elements.sort.value=['source','new','price'].includes(params.get('sort'))?params.get('sort'):'source';
 function render(){
  const state={category,query:form.elements.query.value,budget:form.elements.budget.value,sort:form.elements.sort.value};const list=selectProducts(state);
  section.querySelector('#plant-grid').innerHTML=list.map(card).join('');
  localizeCatalog(section);
  section.querySelector('#catalog-count').textContent=t(`${list.length} ${list.length===1?'вариант':list.length>1&&list.length<5?'варианта':'вариантов'}`);
  section.querySelector('#catalog-empty').hidden=!!list.length;
  section.querySelector('#gift-intro').hidden=scenario!=='gift';
  section.querySelector('.catalog-budget-note').hidden=!state.budget;
  section.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
  document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===scenario)));
  const url=new URL(location.href);for(const [key,value] of Object.entries({category:category==='all'?'':category,mode:scenario==='self'?'':'gift',q:state.query,budget:state.budget,sort:state.sort==='source'?'':state.sort})){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}
  history.replaceState(null,'',url.pathname+url.search+url.hash);updateLanguageLinks();
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',render);form.addEventListener('change',render);
 form.addEventListener('reset',e=>{e.preventDefault();category='all';form.elements.query.value='';form.elements.budget.value='';form.elements.sort.value='source';render();});
 section.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;render();}));
 document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{scenario=b.dataset.scenario;render();}));
 const dialog=document.querySelector('#product-dialog');let trigger;
 section.addEventListener('click',e=>{const button=e.target.closest('[data-catalog-product]');if(!button)return;const p=products.find(p=>p.id===button.dataset.catalogProduct);if(!p)return;trigger=button;dialog.dataset.activeCatalog='plants';
 const message=`Русский:\nЗдравствуйте! Интересует ${p.name}. Цена в подборке: ${priceLabel(p)}. Подтвердите, пожалуйста, актуальное наличие, итоговую стоимость, размер и состав комплекта.\n\nO‘zbekcha:\nAssalomu alaykum! ${p.name} o‘simligiga qiziqyapman. To‘plamdagi narx: ${catalogText(priceLabel(p), 'uz')}. Iltimos, mavjudligi, yakuniy narxi, o‘lchami va to‘plam tarkibini tasdiqlang.`;
 document.querySelector('#product-details').innerHTML=`<div class="dialog-photo">${productImage(p)}</div><div class="dialog-copy"><h2 id="product-title" data-source-copy lang="ru">${esc(p.name)}</h2><p class="source-price">${priceLabel(p)}</p><p class="source-description-full" data-source-copy lang="ru">${esc(p.description)}</p>${reviewNotes(p).map(n=>`<p class="catalog-review-note">${n}</p>`).join('')}<h3>Подтвердим перед заказом</h3><p>Уточним наличие, размер, кашпо и доставку. Цена в публикации может измениться. Открытие Telegram не отправляет сообщение и не оформляет заказ.</p><a class="button button-gold" href="https://t.me/RM_3112?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer">Уточнить и заказать ↗</a><small>Фотография из материалов магазина. Каждый экземпляр может отличаться.</small></div>`;localizeCatalog(document.querySelector('#product-details'));dialog.showModal();document.body.classList.add('dialog-open');
 });dialog.addEventListener('close',()=>{if(dialog.dataset.activeCatalog==='plants')trigger?.focus();});render();
}
export function initReviews(page){
 if(!['home','plants','spaces'].includes(page))return;
 const selected=page==='spaces'?[reviews[3],reviews[4]]:[reviews[0],reviews[2]];
 const html=`<section class="customer-stories section wrap" aria-label="Отзывы и фотографии покупателей"><div class="section-heading"><div><p class="eyebrow">${page==='spaces'?'РАСТЕНИЯ В ИНТЕРЬЕРЕ':'ПОСЛЕ ПОКУПКИ'}</p><h2>${page==='spaces'?'Живые детали<br>на своих местах.':'Зелёные истории<br>наших покупателей.'}</h2></div><p>${page==='spaces'?'Фотографии покупателей из раздела отзывов. Это не кейс озеленения под ключ.':'Отзывы из сообщества магазина. Цитаты сохранены на языке оригинала, без имён и контактов.'}</p></div><div class="customer-story-grid">${selected.map(r=>`<figure class="customer-story"><img src="${r.image}" alt="Растение на фотографии покупателя" width="600" height="800" loading="lazy" decoding="async"><figcaption>${r.quote?`<blockquote data-source-copy lang="ru">«${esc(r.quote)}»</blockquote>`:''}<p>Фото покупателя · ${r.date.split('-').reverse().join('.')}</p></figcaption></figure>`).join('')}</div></section>`;
 document.querySelector('main .contact-band')?.insertAdjacentHTML('beforebegin',html);
 const stories=document.querySelector('.customer-stories');if(stories)localizeCatalog(stories);
 // Replace the old missing-review placeholder, if present, without touching the home collage.
 document.querySelectorAll('.review-placeholder').forEach(n=>n.remove());
}
