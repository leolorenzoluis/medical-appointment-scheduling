import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute }           from '@angular/router';

import { AppState }               from '../app.service';
import { Appointment }            from '../api/model/appointment';
import { AppointmentService }     from '../api/api/appointment.service';

@Component({
  template: require('./accept-offer.html'),
  styles: [ require('./accept-offer.style.scss') ]
})
export class AcceptOfferComponent implements OnInit {

  private acceptedAppointment: Appointment;
  private failed: boolean;

  constructor(
    private _state: AppState,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService) {}

  ngOnInit() {
    this._state.isSubPage.next(true); // TODO block this #114
    this._state.title.next('Accept appointment');
    this._state.actions.next();
    this._state.primaryAction.next();
    this.appointmentService.appointmentAcceptOffer(this.route.snapshot.params['secret'])
    .subscribe(
      appointment => this.acceptedAppointment = appointment,
      err => {
        console.log(err);
        if (err._body.error.status === 404 && err._body.error.code === 'NOT_FOUND_OR_EXPIRED') {
          this.failed = true;
        } else {
          console.log(err);
        }
      },
      () => console.log('Accepted offer successfully.')
    );
  }
}