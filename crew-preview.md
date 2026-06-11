---
layout: page
title: Экипаж — превью
---

<script setup>
import MRCrew from './.vitepress/main-page/MRCrew.vue'
</script>

<MRCrew />

<!--
ПРЕВЬЮ-СТРАНИЦА для компонента MRCrew.

Как использовать:
1. Положите MRCrew.vue в .vitepress/main-page/
2. Положите этот файл (crew-preview.md) в корень проекта (рядом с index.md)
3. Откройте /crew-preview

Когда компонент понравится — добавьте его на главную в ModulRostaPage.vue:

  import MRCrew from './MRCrew.vue'
  ...
  <MRProtocol />
  <MRCrew />          ← логичное место: после протокола, перед Ранскейлом
  <MRRunscale404 />

Фото: в MRCrew.vue у каждого человека есть поле photo (сейчас null —
показываются инициалы). Укажите путь к файлу, например '/ars/crew/mikhail.jpg',
и аватар станет фотографией. Ссылки на телеграм — поле tg там же.
-->
