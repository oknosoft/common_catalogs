import React from 'react';
import IconChart from '@material-ui/icons/InsertChart';
//import IconDoc from '@material-ui/icons/EventNote';
import IconInfo from '@material-ui/icons/Info';
import IconHelp from '@material-ui/icons/Help';
import IconPerson from '@material-ui/icons/Person';
import IconSettings from '@material-ui/icons/Settings';
import IconBusiness from '@material-ui/icons/Business';
import IconPeople from '@material-ui/icons/People';
import IconRouter from '@material-ui/icons/Router';

export const stitle = 'common-catalogs';
export const htitle = 'Общие справочники';
export const ltitle = 'Общие данные';
export const description = 'Администрирование общих справочников';

const items = [
  {
    text: 'Цвета',
    id: 'cat_clrs',
    navigate: '/cat.clrs/list',
    need_meta: true,
    need_user: true,
    icon: <IconRouter/>,
  },
  // {
  //   text: 'Пользователи',
  //   id: 'cat_users',
  //   navigate: '/cat.users/list',
  //   need_meta: true,
  //   need_user: true,
  //   icon: <IconPerson/>,
  // },
  // {
  //   divider: true,
  // },
  // {
  //   text: 'Движение денег',
  //   id: 'rep_cash_moving',
  //   navigate: '/rep.cash_moving/main',
  //   need_meta: true,
  //   need_user: true,
  //   icon: <IconChart/>,
  // },
  {
    divider: true,
  },
  {
    text: 'Настройки',
    navigate: '/settings',
    need_meta: true,
    icon: <IconSettings/>,
  },
  // {
  //   text: 'Справка',
  //   navigate: '/help',
  //   icon: <IconHelp/>
  // },
  {
    text: 'О программе',
    navigate: '/about',
    icon: <IconInfo/>
  }
];

function path_ok(path, item) {
  const pos = item.navigate && item.navigate.indexOf(path);
  return pos === 0 || pos === 1;
}

function with_recursion(path, parent) {
  if(path && path != '/'){
    for(const item of parent){
      const props = item.items ? with_recursion(path, item.items) : path_ok(path, item) && item;
      if(props){
        return props;
      }
    }
  }
}

export function item_props(path) {
  if(!path){
    path = location.pathname;
  }
  if(path.endsWith('/')) {
    path = path.substr(0, path.length - 1);
  }
  // здесь можно переопределить нужность meta и авторизованности для корневой страницы
  let res = with_recursion(path, items);
  if(!res && path.indexOf('/') !== -1) {
    res = with_recursion(path.substr(0, path.lastIndexOf('/')), items);
  }
  if(!res && path.match(/\/(doc|cat|ireg|cch|rep)\./)){
    res = {need_meta: true, need_user: true};
  }
  return res || {};
}

export default items;
