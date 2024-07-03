import {Injectable} from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'feather icon-align-left',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'ListUser',
        title: 'Technician account', 
        type: 'item',
        url: '/test/listTechnician',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      // {
      //   id: 'accounttechnician',
      //   title: 'Technician account',
      //   type: 'item',
      //   url: '/test/listTechnician',
      //   classes: 'nav-item',
      //   icon: 'feather icon-sidebar'
      // }
      // ,
      {
        id: 'listContrct',
        title: 'Client Folders',
        type: 'item',
        url: '/test/listContract',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'listTypeSupport',
        title: 'Type Support',
        type: 'item',
        url: '/test/typesupports',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'CalnderAdmin',
        title: 'Calendar',
        type: 'item',
        url: '/test/clanderVisitepreventive',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
        },
        {
          id: 'clientListContract',
          title: 'List of customer contracts',
          type: 'item',
          url: '/clientMang/contract-List-Cli',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
          },
        // 
        {
        // <i class="fa-regular fa-user"></i>
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'feather fa-user',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
