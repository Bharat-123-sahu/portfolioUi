import { BaseCrudService } from "src/app/core/services/base/base-crud.service";
import { About } from "../models/about.model";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})
export class AboutService extends BaseCrudService<About>{

  protected override endpoint =
      `${environment.apiUrl}/api/v1/admin/about`;

}