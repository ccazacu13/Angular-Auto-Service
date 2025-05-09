import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClientsComponent } from './clients/clients.component';
import { CarsComponent } from './cars/cars.component';
import { AppointmensComponent } from './appointmens/appointmens.component';
import { HistoryComponent } from './history/history.component';
import { Component } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routeConfig : Routes = [
    {
      path: '',
      component: HomeComponent,
      title: 'Home page'
    },
    {
      path: 'clients',
      component: ClientsComponent,
      title: 'Clients details'
    },
    {
      path: 'cars/:id',
      component: CarsComponent,
      title: 'Car details'
    },
    {
      path: 'appointments',
      component: AppointmensComponent,
      title: 'Appointments'
    },
    {
      path: 'history',
      component:HistoryComponent,
      title: 'History'
    },
    {
      path: '**',
      component:PageNotFoundComponent,
      title: 'Not Found: 404'
    }
  ];

export default routeConfig;