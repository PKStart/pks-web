import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { NotificationService } from '../shared/services/notification.service'
import { AuthService } from './auth.service'
import { AuthStore } from './auth.store'
import { parseError } from '../../utils/parse-error'

@Component({
  selector: 'pk-auth',
  template: `
    <div class="auth">
      <div class="container">
        <pk-logo
          size="75%"
          mainColor="var(--color-bg-dark)"
          glow="var(--color-primary)"
          opacity="0.5"
        ></pk-logo>
        <div class="loading" *ngIf="loading">
          <mat-spinner diameter="32" color="accent"></mat-spinner>
        </div>
        <ng-container *ngIf="!loading && step === 0">
          <mat-form-field appearance="outline" color="primary">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              name="auth-email"
              [(ngModel)]="email"
              (keyup.enter)="onRequestLoginCode()"
            />
            <button
              *ngIf="!usePassword"
              matSuffix
              mat-icon-button
              color="primary"
              data-id="get-login-code-button"
              [disabled]="!email.length"
              (click)="onRequestLoginCode()"
            >
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-form-field>
          <mat-form-field *ngIf="usePassword" appearance="outline" color="primary">
            <mat-label>Password</mat-label>
            <input
              matInput
              type="password"
              name="auth-password"
              [(ngModel)]="password"
              (keyup.enter)="onPasswordLogin()"
            />
            <button
              matSuffix
              mat-icon-button
              color="primary"
              data-id="password-login-button"
              [disabled]="!password.length"
              (click)="onPasswordLogin()"
            >
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-form-field>
          <p>
            <small *ngIf="!usePassword">
              <a data-id="use-password-link" [routerLink]="" (click)="usePassword = true">
                Use password
              </a>
            </small>
            <small *ngIf="usePassword">
              <a data-id="use-email-login-link" [routerLink]="" (click)="usePassword = false">
                Use email login code
              </a>
            </small>
          </p>
          <p>
            <small *ngIf="hasEmailSaved">
              <a data-id="have-login-code-link" [routerLink]="" (click)="step = 1">
                I already have a login code
              </a>
            </small>
            <small *ngIf="!hasEmailSaved" [ngStyle]="{ opacity: 0 }"> placeholder </small>
          </p>
        </ng-container>
        <ng-container *ngIf="!loading && step === 1">
          <mat-form-field appearance="outline" color="primary">
            <mat-label>Login code</mat-label>
            <input
              matInput
              type="text"
              name="auth-loginCode"
              [(ngModel)]="loginCode"
              (keyup.enter)="onCodeLogin()"
            />
            <button
              matSuffix
              mat-icon-button
              color="primary"
              data-id="login-button"
              [disabled]="loginCode.length !== 6"
              (click)="onCodeLogin()"
            >
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-form-field>
          <p>
            <small>
              <a data-id="need-login-code-link" [routerLink]="" (click)="step = 0">
                I need a new login code
              </a>
            </small>
          </p>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .auth {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
      mat-form-field {
        width: 350px;
        max-width: 90%;
      }
      .loading {
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      a {
        cursor: pointer;
      }
    `,
  ],
})
export class AuthComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  public email = ''
  public loginCode = ''
  public password = ''
  public step = 0
  public hasEmailSaved = false
  public usePassword = false
  public loading = false

  constructor(
    private authService: AuthService,
    private authStore: AuthStore,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.subscriptions.add(this.authStore.email$.subscribe(email => (this.hasEmailSaved = !!email)))
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  public onRequestLoginCode(): void {
    if (this.usePassword) {
      return
    }
    this.loading = true
    this.authService.requestLoginCode(this.email).subscribe({
      next: () => {
        this.step = 1
        this.loading = false
      },
      error: err => {
        this.notificationService.showError('Could not request login code. ' + parseError(err))
        this.loading = false
      },
    })
    this.email = ''
  }

  public onCodeLogin(): void {
    this.loading = true
    this.authService.verifyLoginCode(this.loginCode).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(['/']).then()
      },
      error: err => {
        this.notificationService.showError('Login failed. ' + parseError(err))
        this.loading = false
      },
    })
  }

  public onPasswordLogin(): void {
    this.loading = true
    this.authService.verifyPassword({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(['/']).then()
      },
      error: err => {
        this.notificationService.showError('Login failed. ' + parseError(err))
        this.loading = false
      },
    })
  }
}
