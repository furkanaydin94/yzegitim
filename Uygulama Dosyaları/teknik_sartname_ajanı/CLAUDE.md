# Personel Servisi Şartname Projesi

Bu klasör bir **Agent Teams** çalışma ortamıdır. Üç uzman ajan paralel çalışarak personel servisi hizmet alımı teknik şartnamesini hazırlar.

## Takım Yapısı

| Ajan | Rol | Çıktı |
|---|---|---|
| `teknik-sartname-uzmani` | Araç, güzergah, sürücü, KPI standartları | Bölüm 1–6 |
| `hukuk-musaviri` | Mevzuat, sözleşme, ceza, sigorta hükümleri | Bölüm 7–12 |
| `kalite-kontrolcu` | Kalite kontrolü + Word belgesi oluşturma | `personel-servisi-sartname.docx` |

## Ortak Dosyalar

- **`paylasim-baglamlari.md`** — ajanların birbirine mesaj bıraktığı, ilerlemeyi takip ettiği merkezi dosya. Her ajan çalışmaya başlamadan önce bu dosyayı okur, tamamladıklarını buraya yazar.
- **`personel-servisi-sartname.docx`** — kalite-kontrolcu tarafından en sona oluşturulur.

## Çalışma Akışı

1. `teknik-sartname-uzmani` ve `hukuk-musaviri` **paralel** çalışır.
2. Her ajan tamamladığı bölümü `paylasim-baglamlari.md` dosyasına işaretler.
3. Çelişen veya eksik maddeler için ajanlar birbirine doğrudan mesaj atar.
4. `kalite-kontrolcu` her iki ajanın çıktısını inceler, düzeltme talep eder.
5. Tüm onaylar alındıktan sonra `kalite-kontrolcu` Word belgesini oluşturur.

## Kurallar

- Hiçbir ajan kendi bölümü dışına müdahale etmez.
- `paylasim-baglamlari.md` üzerine her güncelleme tarihsiz yazılmaz.
- `personel-servisi-sartname.docx` yalnızca kalite-kontrolcu tarafından oluşturulur.
- Çelişen kararlar için `paylasim-baglamlari.md` → Ortak Tartışma Alanı kullanılır.

## Otomatik Tetikleyici

Kullanıcı aşağıdaki ifadelerden birini yazdığında (tam eşleşme gerekmez) ajan iş akışını **otomatik olarak** başlat:

- "teknik şartname oluştur"
- "şartname oluştur"
- "şartname güncelle"
- "ajanları çalıştır"

**Yapılacaklar (sırasıyla):**
1. `teknik-sartname-uzmani` ve `hukuk-musaviri` ajanlarını **aynı anda paralel** başlat.
2. Her ikisi tamamlandıktan sonra `kalite-kontrolcu` ajanını başlat.
3. Kullanıcıya sonucu özetle.

Kullanıcı "paralel çalıştır" demesine gerek yoktur — tetikleyici ifade yeterlidir.

## Bağımlılıklar

- Python 3.x
- `python-docx` kütüphanesi (`pip install python-docx`)
