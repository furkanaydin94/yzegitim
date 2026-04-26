# İSPER AŞ — Sunum Oluşturma Talimatları (Claude için)

Bu dosya, Claude'un İSPER AŞ adına sunum oluştururken takip etmesi gereken kuralları içerir.

---

## TEMEL KURAL

Her sunum bu klasördeki marka kimliğine TAM olarak uygun olmalıdır.
Asla varsayılan veya genel şablon kullanma. Daima İSPER renkleri, fontları ve logosu kullanılmalıdır.

---

## SUNUM OLUŞTURURKEN ADIMLAR

### 1. Şablonu Temel Al
- `isper-bos-taslak.pptx` dosyasını her zaman başlangıç noktası olarak kullan
- Bu dosya slide master, layoutlar ve logoyu içerir

### 2. Zorunlu Elementler (Her Slayta)
- Üst kırmızı şerit (`#E2231A`) — Slide master'dan otomatik gelir
- Logo (`logolar/isper-ibb-logo-yatay.png`) — kapak ve bölüm slaytlarında
- Slayt numarası — sağ alt köşe

### 3. Slayt Yapısı

#### Kapak Slaydı (Slayt 1)
```
- Başlık: Şirket adı "İSPER AŞ" — 80pt, Bold, Beyaz, sol orta
- Alt başlık: Sunum konusu — 32pt, Bold İtalik, Beyaz
- Sağ alt: Kırmızı trapez dekoratif şekil (#E2231A)
- Arka plan: Koyu renk (lacivert/gri)
- Watermark: ibb-siluet-watermark.png (saydam, arka planda)
- Logo: isper-ibb-logo-yatay.png
```

#### Bölüm Ayraç Slaydı
```
- Sadece bölüm başlığı, büyük harf, 36pt, İtalik
- Sade, az element
- Kırmızı şerit üstte
```

#### İçerik Slaydı
```
- Başlık: Sol üst, BÜYÜK HARF, 28–36pt
- İçerik alanı: Grafik, tablo veya madde işaretli metin
- Dipnot (varsa): Alt kısım, 10–12pt, gri
- Slayt numarası: Sağ alt
```

#### Kapanış / Teşekkür Slaydı (Son Slayt)
```
- "Teşekkürler" merkezi, büyük font
- Logo görünür
- Sade arka plan
```

---

## RENK KULLANIMI

| Durum                     | Renk Kodu |
|---------------------------|-----------|
| Vurgu, şerit, dekorasyon  | `#E2231A` |
| Arka plan (içerik slaytı) | `#FFFFFF` |
| Ana metin                 | `#000000` |
| İkincil metin / dipnot    | `#44546A` |
| Grafik seri 1             | `#4472C4` |
| Grafik seri 2             | `#ED7D31` |
| Grafik seri 3 (kritik)    | `#E2231A` |

---

## TİPOGRAFİ

- **Tüm fontlar:** Calibri veya Calibri Light
- **Başlıklar:** Calibri Light veya Calibri Bold
- **Gövde:** Calibri Regular
- **Başlıkları BÜYÜK HARF yaz**
- **Kapak alt başlığı:** Bold + İtalik

---

## YAPILMAMASI GEREKENLER

- Kırmızı şerit olmayan slayt oluşturma
- Farklı font kullanma (Calibri dışında)
- Logoyu kaldırma veya değiştirme
- `#E2231A` dışında marka rengi olarak başka renk kullanma
- Slayt numarasını unutma
- Çok kalabalık slaytlar — her slayt tek bir mesaj taşımalı

---

## SUNUM DOSYASI KAYDETME

Oluşturulan sunumları `C:\Users\furka\Desktop\cowork test\` klasörüne kaydet.
İsim formatı: `ISPER_[KONU]_[TARİH].pptx`
Örnek: `ISPER_YillikRapor_2026.pptx`

---

*Bu talimatlar İSPER AŞ marka kimliği kılavuzuna dayanmaktadır.*
