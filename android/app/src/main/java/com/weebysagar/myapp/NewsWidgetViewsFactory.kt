package com.weebysagar.myapp

import android.content.Context
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import org.json.JSONArray

class NewsWidgetViewsFactory(private val context: Context) : RemoteViewsService.RemoteViewsFactory {

    private var articles = JSONArray()

    override fun onCreate() {
        // Not needed
    }

    override fun onDataSetChanged() {
        val sharedPreferences = context.getSharedPreferences("news_widget_data", 0)
        val newsData = sharedPreferences.getString("news_data", null)
        if (newsData != null) {
            articles = JSONArray(newsData)
        }
    }

    override fun onDestroy() {
        // Not needed
    }

    override fun getCount(): Int {
        return articles.length()
    }

    override fun getViewAt(position: Int): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.news_widget_item)
        val article = articles.getJSONObject(position)
        views.setTextViewText(R.id.widget_item_title, article.getString("title"))
        return views
    }

    override fun getLoadingView(): RemoteViews? {
        return null
    }

    override fun getViewTypeCount(): Int {
        return 1
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun hasStableIds(): Boolean {
        return true
    }
}