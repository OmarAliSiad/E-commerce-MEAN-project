import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

export interface UpdateUserPayload {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserResponse {
  updatedUser: {
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
  token: string;
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private apiUrl = `${environment.apiUrl}/users`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,      'Content-Type': 'application/json',
    });
  }

  /*Update user profile information*/
  updateProfile(userData: UpdateUserPayload) {
    return this.http.patch<UpdateUserResponse>(`${this.apiUrl}/update`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  /*Update user password*/
  updatePassword(passwordData: UpdatePasswordPayload) {
    return this.http.patch(`${this.apiUrl}/update-password`, passwordData, {
      headers: this.getAuthHeaders(),
    });
  }
}
