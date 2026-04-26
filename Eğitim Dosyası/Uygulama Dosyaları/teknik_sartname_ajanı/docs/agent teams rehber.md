# Agent Teams Rehberi

Agent Teams, birden fazla Claude Code örneğini koordineli şekilde çalıştırmana olanak tanır. Bir oturum "takım lideri" olarak görev yapar; görevleri dağıtır, koordinasyonu sağlar ve sonuçları bir araya getirir. Diğer üyeler bağımsız çalışır ve birbirleriyle doğrudan iletişim kurabilir.

---

## Etkinleştirme

Agent Teams varsayılan olarak kapalıdır. `.claude/settings.json` dosyasına şunu ekle:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

> Claude Code v2.1.32 veya üzeri gereklidir. `claude --version` ile kontrol edebilirsin.

---

## Ne Zaman Kullanmalı?

### En İyi Kullanım Senaryoları
- **Araştırma ve inceleme**: Farklı üyeler aynı anda farklı açıları araştırır
- **Yeni modüller veya özellikler**: Her üye bağımsız bir parçaya sahip olur
- **Yarışan hipotezlerle hata ayıklama**: Üyeler farklı teorileri paralel test eder
- **Katmanlar arası koordinasyon**: Frontend, backend ve testler ayrı üyelere verilir

### Kullanma — Subagent Tercih Et
- Sıralı görevler
- Aynı dosya üzerinde düzenlemeler
- Çok sayıda bağımlılığı olan işler
- Basit ve odaklı tek görevler

---

## Subagent ile Farkı

| | Subagents | Agent Teams |
|---|---|---|
| **Bağlam** | Kendi context window'u; sonuçlar ana ajana döner | Kendi context window'u; tamamen bağımsız |
| **İletişim** | Yalnızca ana ajana rapor verir | Üyeler birbirleriyle doğrudan mesajlaşır |
| **Koordinasyon** | Ana ajan tüm işi yönetir | Paylaşılan görev listesiyle öz-koordinasyon |
| **En iyi kullanım** | Yalnızca sonucun önemli olduğu odaklı görevler | Tartışma ve işbirliği gerektiren karmaşık işler |
| **Token maliyeti** | Düşük | Yüksek (her üye ayrı bir Claude örneği) |

---

## Takım Başlatma

Doğal dilde takım ve görev yapısını tarif et:

```
CLI aracı tasarlıyorum. Farklı açılardan araştırmak için bir agent team oluştur:
bir üye UX'e, biri teknik mimariye, biri şeytan avukatı rolüne baksın.
```

---

## Takım Kontrolü

### Görünüm Modları

| Mod | Açıklama | Gereksinim |
|---|---|---|
| **in-process** (varsayılan) | Tüm üyeler ana terminalde; `Shift+Down` ile aralarında geçiş | Herhangi bir terminal |
| **split panes** | Her üye kendi bölmesinde | tmux veya iTerm2 |

`~/.claude.json` dosyasında mod ayarı:
```json
{
  "teammateMode": "in-process"
}
```

Tek oturum için:
```bash
claude --teammate-mode in-process
```

### Model Belirleme
```
4 üyeden oluşan bir takım oluştur. Her üye için Sonnet kullan.
```

### Plan Onayı Zorunlu Kılma
```
Kimlik doğrulama modülünü yeniden yapılandırmak için bir mimar üye oluştur.
Değişiklik yapmadan önce plan onayı iste.
```
- Üye plan hazırlar → lider inceler → onaylar veya geri bildirimle reddeder
- Onaylanana kadar üye sadece okuma modunda kalır

### Üyelerle Doğrudan Konuşma
- **in-process**: `Shift+Down` ile üyeye geç, mesajını yaz
- `Enter` → üyenin oturumunu görüntüle | `Escape` → mevcut turu durdur
- `Ctrl+T` → görev listesini aç/kapat

### Takımı Temizleme
```
Takımı temizle
```
> **Önemli:** Temizliği her zaman lider yapmalı. Üyeler temizleme yapmamalı — tutarsız duruma yol açabilir.

---

## Mimari

| Bileşen | Rol |
|---|---|
| **Takım Lideri** | Takımı oluşturan, üyeleri doğuran ve koordinasyonu sağlayan ana oturum |
| **Üyeler** | Atanan görevler üzerinde çalışan bağımsız Claude Code örnekleri |
| **Görev Listesi** | Üyelerin üstlenip tamamladığı paylaşılan iş öğeleri |
| **Posta Kutusu** | Ajanlar arası mesajlaşma sistemi |

Takım verileri yerel olarak saklanır:
- Takım yapılandırması: `~/.claude/teams/{takim-adi}/config.json`
- Görev listesi: `~/.claude/tasks/{takim-adi}/`

> `config.json` dosyasını elle düzenleme — her durum güncellemesinde üzerine yazılır.

---

## Subagent Tanımlarını Üye Olarak Kullanma

Proje, kullanıcı veya plugin kapsamından bir subagent türünü üye olarak çağırabilirsin:

```
security-reviewer agent türünü kullanarak auth modülünü denetlemek için bir üye oluştur.
```

- Tanımın `tools` izin listesi ve `model` ayarı uygulanır
- Takım koordinasyon araçları (`SendMessage`, görev yönetimi) her zaman kullanılabilir
- `skills` ve `mcpServers` ön yüz alanları takım üyesi olarak çalışırken uygulanmaz

---

## En İyi Pratikler

### 1. Üyelere Yeterli Bağlam Ver
Üyeler, liderin konuşma geçmişini devralmaz. Doğuş istemi içinde detayları belirt:

```
Kimlik doğrulama modülünü src/auth/ konumunda güvenlik açıkları için incele.
Token yönetimi, oturum yönetimi ve girdi doğrulamaya odaklan.
Uygulama httpOnly cookie'lerde saklanan JWT tokenları kullanıyor.
Sorunları önem derecesiyle birlikte raporla.
```

### 2. Uygun Takım Büyüklüğünü Seç
- **Başlangıç için 3-5 üye** önerilir
- Her üye için **5-6 görev** ideal dengedir
- Token maliyeti doğrusal olarak artar — gerçekten ihtiyaç olmadan büyütme

### 3. Görevleri Doğru Boyutla
- **Çok küçük**: koordinasyon yükü faydayı aşar
- **Çok büyük**: kontrol noktaları olmadan çok uzun çalışır, boşa harcanan çaba riski
- **Doğru boyut**: net bir çıktı üretilebilecek bağımsız birimler (bir fonksiyon, test dosyası, inceleme)

### 4. Dosya Çakışmalarından Kaçın
İki üye aynı dosyayı düzenlerse üzerine yazma olur. Her üyenin farklı dosya setine sahip olmasını sağla.

### 5. İzle ve Yönlendir
- Üyelerin ilerlemesini düzenli kontrol et
- İşe yaramayan yaklaşımları yeniden yönlendir
- Sonuçları geldikçe sentezle
- Takımı uzun süre gözetimsiz bırakma

### 6. Liderden Önce Üyeleri Beklemesini İste
Lider görevleri kendisi yapmaya başlarsa:
```
Devam etmeden önce üyelerinin görevlerini tamamlamasını bekle.
```

### 7. Araştırma ve İncelemeyle Başla
Agent Teams'e yeniysen, kod yazmadan önce net sınırlı görevlerle başla: PR inceleme, kütüphane araştırması veya hata araştırması.

---

## Kullanım Örnekleri

### Paralel Kod İncelemesi
```
PR #142'yi incelemek için bir agent team oluştur. Üç inceleyici oluştur:
- Biri güvenlik açıklarına odaklanır
- Biri performans etkisini kontrol eder
- Biri test kapsamını doğrular
Her biri inceleme yapıp bulgularını raporlasın.
```

### Yarışan Hipotezlerle Araştırma
```
Uygulama bir mesajdan sonra kapanıyor. 5 agent team üyesi oluştur,
her biri farklı hipotez araştırsın. Birbirlerinin teorilerini çürütmeye
çalışsınlar — bilimsel tartışma gibi. Elde edilen uzlaşıyı findings.md dosyasına yaz.
```

---

## Sorun Giderme

| Sorun | Çözüm |
|---|---|
| Üyeler görünmüyor | `Shift+Down` ile kontrol et; tmux kurulu mu dene |
| Çok fazla izin isteği | Üyeleri doğurmadan önce ortak işlemleri izinlerde önceden onayla |
| Üye hata sonrası duruyor | Doğrudan talimat ver veya yeni üye oluştur |
| Lider iş bitmeden kapanıyor | "Devam etmeden önce üyelerini bekle" de |
| Artık kalan tmux oturumları | `tmux ls` → `tmux kill-session -t <oturum-adi>` |

---

## Bilinen Kısıtlamalar

- `/resume` ve `/rewind` in-process üyeleri geri yüklemez
- Görev durumu bazen gecikebilir — bağımlı görevler takılı kalabilir
- Kapatma yavaş olabilir (mevcut iş tamamlanana kadar bekler)
- Oturum başına yalnızca **bir takım** yönetilebilir
- **İç içe takım yok**: üyeler kendi takımlarını oluşturamaz
- Lider sabittir — liderliği başka üyeye devredemezsin
- İzinler doğuş sırasında belirlenir, sonradan bireysel değiştirilebilir
- Split panes VS Code terminali, Windows Terminal veya Ghostty'de desteklenmez

---

## İlgili Konular

- **Subagents**: koordinasyon gerektirmeyen görevler için daha hafif seçenek
- **Git Worktrees**: manuel paralel oturumlar için
