# YZ Eğitim Slaytları — Proje Notları

Bu proje Yapay Zeka eğitim sunumunun HTML slaytlarından oluşur.
Tüm slaytlar `Eğitim Dosyası/` klasörü altında, bölüm klasörlerine göre ayrılmıştır.

---

## BÖLÜM 3 — Teknik Kullanım

### Slayt Sırası

```
23-bolum3-kapak.html
24-ai-ideler.html
25-claude-code-detay.html
27-haber-ajani.html   ← DEĞİŞECEK (aşağıya bak)
28-n8n.html
29-uygulamalar.html
30-local-llm.html
31-model-parametreleri.html
33-benchmark.html
34-ft-vs-rag.html
35-kurumsal-ai.html
36-gelecek.html
```

---

## DEĞİŞİKLİK TALEBİ: 27-haber-ajani.html

### Ne Yapılacak?

`27-haber-ajani.html` dosyasının **tüm içeriği yeniden yazılacak**.
"Haber Ajanı" konusu kaldırılıyor; yerine **Teknik Şartname Oluşturucu** canlı örnek akış diyagramı geliyor.

### Yeni İçerik: Teknik Şartname Agent Diyagramı

`agent teams eğitimi/` klasöründeki gerçek projenin yapısı görsel olarak anlatılacak.

#### Gerçek Proje Yapısı

```
/sartname  (slash command)
    │
    ├──► teknik-sartname-uzmani (Ajan 1)
    │        Araç, güzergah, sürücü, KPI bölümleri
    │        → paylasim-baglamlari.md'ye yazar
    │
    ├──► hukuk-musaviri (Ajan 2)          ← PARALEL ÇALIŞIR
    │        Sözleşme, sigorta, KVKK, idari şartlar
    │        → paylasim-baglamlari.md'ye yazar
    │
    ▼
    paylasim-baglamlari.md  (ortak bağlam dosyası)
    │
    ▼
    kalite-kontrolcu (Ajan 3)
         Her iki çıktıyı inceler, tutarsızlıkları çözer
         → personel-servisi-sartname.docx oluşturur
```

#### Tasarım Referansı

`25-claude-code-detay.html` dosyasının **"Multi-Agent"** sekmesindeki SVG akış diyagramı
(flow-shell → flow-row → flow-card → parallel-stack → flow-card output) aynı yapıyla kullanılacak.

Fark: Oradaki generic "Teknik uzman / Hukuk müşaviri" kutularının yerine bu seferki
gerçek proje isimleri ve açıklamaları kullanılacak.

#### Sol Panel İçeriği

- Badge: `Bölüm 3 · Canlı Örnek`
- Başlık: "Teknik Şartname" / "Oluşturucu"
- Açıklama: 3 ajan + 1 slash command ile tam iş akışı
- Kutu 1: Proje klasör yapısı (`.claude/agents/`, `.claude/commands/`)
- Kutu 2: Nasıl çalıştırılır → `/sartname` komutu

#### Sağ Panel İçeriği

- Tek tab, direk SVG diyagramı (Rehber / Yapı ayrımı yok)
- Akış: /sartname → [Teknik Uzman ‖ Hukuk Müşaviri] → paylasim-baglamlari.md → Kalite Kontrolcü → .docx

### Navigasyon

- Geri: `25-claude-code-detay.html`
- Sıradaki: `28-n8n.html`

### Referans Dosyalar

| Dosya | Amaç |
|---|---|
| `agent teams eğitimi/CLAUDE.md` | Gerçek proje yapısı |
| `agent teams eğitimi/.claude/agents/teknik-sartname-uzmani.md` | Ajan 1 tanımı |
| `agent teams eğitimi/.claude/agents/hukuk-musaviri.md` | Ajan 2 tanımı |
| `agent teams eğitimi/.claude/agents/kalite-kontrolcu.md` | Ajan 3 tanımı |
| `agent teams eğitimi/.claude/commands/sartname.md` | Slash command |
| `25-claude-code-detay.html` (Multi-Agent sekmesi) | Tasarım şablonu |

---

## GENEL KURALLAR

- Her slayt aynı `SLIDES` dizisini ve `initTimeline()` mantığını kullanır.
- Timeline bar her sayfada `#timeline-bar` div'i içinde dinamik üretilir.
- Sol/sağ panel ayrımı olan slaytlarda sürüklenebilir `v-divider` bulunur.
- Klavye navigasyonu: `ArrowLeft` / `ArrowRight` + `f` tam ekran.
- Accent renk: `#10b981` (yeşil) — Bölüm 3 boyunca sabit.
