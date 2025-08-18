
import WidgetKit
import SwiftUI
import Intents

struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), article: nil)
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), article: nil)
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let entry = SimpleEntry(date: Date(), article: getArticleFromDefaults())
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
    }
    
    func getArticleFromDefaults() -> Article? {
        let sharedDefaults = UserDefaults(suiteName: "group.com.weebysagar.myapp")
        if let data = sharedDefaults?.string(forKey: "news_widget_data"),
           let article = try? JSONDecoder().decode(Article.self, from: data.data(using: .utf8)!) {
            return article
        }
        return nil
    }
}

struct Article: Decodable, Identifiable {
    let id: String
    let title: String
    let localImageUrl: String
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let article: Article?
}

struct LawGuruWidgetEntryView : View {
    var entry: Provider.Entry
    let secondaryColor = Color(red: 108/255, green: 117/255, blue: 125/255)

    var body: some View {
        if let article = entry.article {
            Link(destination: URL(string: "myapp://news/\(article.id)")!) {
                ZStack {
                    if FileManager.default.fileExists(atPath: article.localImageUrl), let uiImage = UIImage(contentsOfFile: article.localImageUrl) {
                        Image(uiImage: uiImage)
                            .resizable()
                            .scaledToFill()
                    } else {
                        Image(systemName: "photo")
                            .resizable()
                            .scaledToFit()
                            .foregroundColor(.white)
                        secondaryColor
                    }

                    VStack {
                        Spacer()
                        Text(article.title)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.black.opacity(0.5))
                    }
                }
            }
        } else {
            ZStack {
                secondaryColor
                Text("No article available")
                    .foregroundColor(.white)
                    .padding()
            }
        }
    }
}

@main
struct LawGuruWidget: Widget {
    let kind: String = "LawGuruWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) {
            LawGuruWidgetEntryView(entry: $0)
        }
        .configurationDisplayName("LawGuru News")
        .description("Get the latest legal news.")
    }
}
