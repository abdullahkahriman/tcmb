import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _ } from 'underscore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TCMB Kurları';
  list: any = [];
  currentExchangeList: any = [];
  exchangeRateList: any = [];
  loading = false;
  errMsg;
  currentID;
  exID;
  price = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    try {
      this.loading = true;
      this.http.get('/api/kur')
        .subscribe((c: any) => {
          c.forEach((element, index) => {
            if (index === 0) {
              this.currentID = element.Currency['@Kod'];
            }

            this.list.push(element.Currency);
          });

          this.list.push({
            '@Kod': 'TRY',
            Isim: 'TÜRK LİRASI',
            ForexBuying: 1,
            ForexSelling: 1
          });

          this.exID = this.list[this.list.length - 1]['@Kod'];

          this.currentExchangeList = this.list;
          this.exchangeRateList = this.list;
          this.loading = false;
        }, err => {
          this.errMsg = err.statusText;
          this.loading = false;
        });
    } catch {
      this.loading = false;
      this.errMsg = '.';
    }
  }

  errCheck() {
    const result: any = {
      isSuccess: false
    };
    if (this.currentID === this.exID) {
      result.msg = 'Aynı kur seçilemez.';
    } else if (this.price === null) {
      result.msg = 'Tutar, geçerli bir değer olmalıdır.';
    } else if (this.price < 0) {
      result.msg = `Tutar 0'dan küçük olamaz.`;
    } else {
      const findCurrent = _.findWhere(this.currentExchangeList, { '@Kod': this.currentID });
      const findExchange = _.findWhere(this.exchangeRateList, { '@Kod': this.exID });

      const currentPrice = parseFloat(findCurrent.ForexBuying) || 0;
      const exchangeRatePrice = parseFloat(findExchange.ForexBuying) || 0;

      const calc = ((currentPrice * this.price) / findExchange.ForexBuying).toFixed(2);
      result.msg = calc + ' ' + findExchange['@Kod'];
      result.isSuccess = true;
    }

    return result;
  }

}
