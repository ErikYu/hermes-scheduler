import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {
  isHeaderTitleString: boolean;
  private _headerTitle: string | TemplateRef<void>;

  @Input()
  get headerTitle(): string | TemplateRef<void> {
    return this._headerTitle;
  }
  set headerTitle(val: string | TemplateRef<void>) {
    this.isHeaderTitleString = !(val instanceof TemplateRef);
    this._headerTitle = val;
  }

  @Input() headerBtn: TemplateRef<void>;

  @Input() headerSearch: TemplateRef<void>;

  @Input() headerNav: TemplateRef<void>;
}
