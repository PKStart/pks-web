import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PersonalData, UUID } from 'pks-common'
import { fromEvent, Subscription } from 'rxjs'
import { debounceTime, delay, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { defaultDialogConfig } from '../../../constants/constants'
import { omit } from '../../../utils/objects'
import { ConfirmationService } from '../../shared/services/confirmation.service'
import { NotificationService } from '../../shared/services/notification.service'
import { AppBarService } from '../app-bar/app-bar.service'
import { PersonalDataDialogComponent } from './personal-data-dialog.component'
import { PersonalDataService } from './personal-data.service'

@Component({
  selector: 'pk-personal-data',
  template: `
    <div class="main-box">
      <header class="main-box-header">
        <h1 class="main-box-title">Personal Data</h1>
        <div class="main-box-actions">
          <button
            mat-icon-button
            matTooltip="Add new"
            matTooltipPosition="left"
            (click)="onAdd()"
            [disabled]="loading$ | async"
          >
            <mat-icon>post_add</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Close" (click)="appBarService.togglePersonalData()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </header>
      <main class="main-box-content">
        <div *ngIf="loading$ | async" class="main-box-loading">
          <mat-spinner diameter="32" color="accent"></mat-spinner>
        </div>
        <ng-container *ngIf="(loading$ | async) === false">
          <mat-form-field appearance="fill">
            <mat-label>Search</mat-label>
            <input #searchInput matInput type="text" class="search-input" />
            <button mat-icon-button matSuffix class="search-btn" (click)="onSearch()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>
          <ng-container *ngIf="results.length">
            <pk-personal-data-card
              *ngFor="let item of results"
              [data]="item"
              (edit)="onEdit($event)"
              (delete)="onDelete($event)"
            >
            </pk-personal-data-card>
          </ng-container>
        </ng-container>
      </main>
    </div>
  `,
  styles: [
    `
      .main-box {
        padding-bottom: 0;
      }

      .search-btn {
        margin-right: -0.5rem;
      }
    `,
  ],
})
export class PersonalDataComponent implements OnDestroy {
  @ViewChild('searchInput') input!: ElementRef<HTMLInputElement>

  public loading$ = this.personalDataService.loading$
  public data: PersonalData[] = []
  public results: PersonalData[] = []

  private subscription = new Subscription()

  constructor(
    public appBarService: AppBarService,
    private personalDataService: PersonalDataService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private matDialog: MatDialog
  ) {
    this.subscription.add(
      this.personalDataService.data$.subscribe(data => {
        this.data = data
        this.results = []
      })
    )
    this.subscription.add(
      this.personalDataService.loading$
        .pipe(
          filter(loading => !loading),
          delay(500),
          switchMap(() => fromEvent(this.input.nativeElement, 'input')),
          distinctUntilChanged(),
          debounceTime(500)
        )
        .subscribe(() => this.onSearch())
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  public onAdd(): void {
    this.matDialog
      .open(PersonalDataDialogComponent, defaultDialogConfig)
      .afterClosed()
      .pipe(
        filter(value => value),
        switchMap(value => this.personalDataService.createPersonalData(value))
      )
      .subscribe({
        next: () => this.personalDataService.fetchData(),
        error: e =>
          this.notificationService.showError('Could not create document. ' + e.error.message),
      })
  }

  public onEdit(id: UUID): void {
    const doc = this.data.find(d => d.id === id)
    if (!doc) return
    this.matDialog
      .open(PersonalDataDialogComponent, {
        ...defaultDialogConfig,
        data: doc,
      })
      .afterClosed()
      .pipe(
        filter(value => value),
        map(value => ({
          id,
          ...omit(value, ['userId', 'createdAt']),
        })),
        switchMap(value => this.personalDataService.updatePersonalData(value))
      )
      .subscribe({
        next: () => this.personalDataService.fetchData(),
        error: e =>
          this.notificationService.showError('Could not update document. ' + e.error.message),
      })
  }

  public onDelete(id: UUID): void {
    const doc = this.data.find(d => d.id === id)
    if (!doc) return
    this.confirmationService
      .question(`Do you really want to delete the document "${doc.name}"?`)
      .pipe(
        filter(isConfirmed => isConfirmed),
        switchMap(() => this.personalDataService.deletePersonalData(id))
      )
      .subscribe({
        next: () => this.personalDataService.fetchData(),
        error: e =>
          this.notificationService.showError('Could not delete document. ' + e.error.message),
      })
  }

  public onSearch(): void {
    const value = this.input.nativeElement.value
    if (!value) {
      this.results = []
    } else if (value === 'all') {
      this.results = [...this.data]
    } else {
      this.results = this.data.filter(({ name }) =>
        name.toLowerCase().includes(value.toLowerCase())
      )
    }
  }
}
