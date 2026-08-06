import { Injectable } from "@angular/core";
import { BaseCrudService } from "src/app/core/services/base/base-crud.service";
import { apiUrl } from "src/app/core/utils/url.util";
import { About } from "../models/about.model";

@Injectable({
  providedIn:'root'
})
export class AboutService extends BaseCrudService<About>{

  protected override endpoint =
      apiUrl('/api/v1/admin/about');

}
