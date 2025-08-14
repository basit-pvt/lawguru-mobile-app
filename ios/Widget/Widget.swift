
import WidgetKit
import SwiftUI
import Intents

struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), articles: [])
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), articles: [])
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Fetch data and create timeline
        fetchNews { articles in
            let entry = SimpleEntry(date: Date(), articles: articles)
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
        }
    }
    
    func fetchNews(completion: @escaping ([Article]) -> ()) {
        let sharedDefaults = UserDefaults(suiteName: "group.com.weebysagar.myapp")
        let isLoggedIn = sharedDefaults?.bool(forKey: "isLoggedIn") ?? false
        let preferredCategories = sharedDefaults?.stringArray(forKey: "preferredCategories") ?? []
        
        var urlString = "https://api.lawguru.com/news"
        if isLoggedIn && !preferredCategories.isEmpty {
            urlString += "?categories=\(preferredCategories.joined(separator: ","))"
        }
        
        guard let url = URL(string: urlString) else {
            completion([])
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data else {
                completion([])
                return
            }
            
            let articles = try? JSONDecoder().decode([Article].self, from: data)
            completion(articles ?? [])
        }.resume()
    }
}

struct Article: Decodable, Identifiable {
    let id: String
    let title: String
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let articles: [Article]
}

struct LawGuruWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack {
            Text("Latest News")
                .font(.headline)
            ForEach(entry.articles) { article in
                Text(article.title)
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
