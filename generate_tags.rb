#!/usr/bin/env ruby
# Скрипт для генерации страниц тегов для GitHub Pages

require 'fileutils'
require 'yaml'

# Путь к папке с постами
POSTS_DIR = '_posts'
TAG_DIR = 'tag'

def extract_tags_from_posts
  tags = []
  
  Dir.glob("#{POSTS_DIR}/*.md").each do |post_file|
    puts "Reading: #{post_file}"
    
    content = File.read(post_file, encoding: 'utf-8')
    
    # Извлекаем front matter
    if content =~ /\A---\s*\n(.*?\n?)^---\s*$/m
      front_matter = YAML.load($1)
      post_tags = front_matter['tags'] || []
      tags.concat(post_tags)
      puts "  Found tags: #{post_tags.inspect}"
    end
  end
  
  tags.uniq
end

def create_tag_page(tag)
  tag_dir_name = tag.downcase
  tag_dir = File.join(TAG_DIR, tag_dir_name)
  FileUtils.mkdir_p(tag_dir)
  
  index_file = File.join(tag_dir, 'index.html')
  
  content = <<~CONTENT
    ---
    layout: default
    title: "Статьи по тегу: #{tag}"
    ---

    <!-- Секция с фоном и слайдами -->
    <div class="relative w-full">   
      <div class="background-blend absolute top-0 left-0 w-full h-full z-10"></div>
      
      <div class="slide-section relative z-20 bg-transparent" data-bg="var(--color-background-top)">
        
        <!-- Заголовок тега -->
        <div class="text-center mt-12 mb-12 md:mb-0">
            <h1 class="text-5xl md:text-9xl font-bold md:scale-y-[2.25] md:-translate-y-full hidden md:block">Размышляем</h1>
            <h1 class="text-base md:text-3xl font-medium md:-translate-y-[150%] hidden md:block">Об обучении, концепциях и подходах</h1>
          
          <!-- Кнопка возврата -->
          <div class="md:mt-4 mt-26 mb-8">
            <a href="{{ site.baseurl }}/" 
               class="px-4 py-2 rounded-full font-medium transition-colors duration-300 border border-transparent"
               style="background-color: var(--color-hover-current-page); color: var(--color-text-current-page);"
               onmouseover="this.style.backgroundColor='var(--color-text-current-page)';this.style.color='var(--color-hover-current-page)';"
               onmouseout="this.style.backgroundColor='var(--color-hover-current-page)';this.style.color='var(--color-text-current-page)';">
              Все статьи
            </a>
            {% assign filtered_posts = site.posts | where_exp: "post", "post.tags contains '#{tag}'" %}
            <span class="ml-4 text-sm opacity-70">Найдено: {{ filtered_posts.size }}</span>
          </div>
        </div>

        {% assign filtered_posts = site.posts | where_exp: "post", "post.tags contains '#{tag}'" %}
        
        {% if filtered_posts.size > 0 %}
          {% for post in filtered_posts %}
            {% include post.html %}
          {% endfor %}
        {% else %}
          <div class="w-full md:max-w-5xl mx-auto px-2 sm:px-4 text-center">
            <p class="text-lg opacity-70">Статей с этим тегом не найдено.</p>
          </div>
        {% endif %}

      </div>

      <div style="height:80vh"></div>
    </div>

    {% include footer.html %}

    <script src="/resources/js/index/main-background.js"></script>
    <script src="/resources/js/smooth-scroll.js"></script>
    <script src="/resources/js/index/authors.js"></script>
    <script src="/resources/js/index/tilt-effect.js"></script>
    <script src="/resources/js/index/parallax-effect.js"></script>
  CONTENT

  File.write(index_file, content, encoding: 'utf-8')
  puts "✅ Created: #{index_file}"
end

def main
  puts "🚀 Генерация страниц тегов для GitHub Pages"
  puts "=" * 50
  
  # Удаляем существующие теги и создаем папку заново
  if Dir.exist?(TAG_DIR)
    puts "\n🗑️  Удаление существующих тегов..."
    FileUtils.rm_rf(TAG_DIR)
    puts "✅ Папка #{TAG_DIR} очищена"
  end
  
  # Создаем основную папку тегов
  FileUtils.mkdir_p(TAG_DIR)
  
  # Извлекаем теги из всех постов
  puts "\n📖 Анализ постов..."
  tags = extract_tags_from_posts
  
  puts "\n🏷️  Найденные теги: #{tags.inspect}"
  
  # Создаем страницы для каждого тега
  puts "\n📁 Создание папок и файлов..."
  tags.each do |tag|
    create_tag_page(tag)
  end
  
  puts "\n🎉 Готово! Создано #{tags.length} страниц тегов"
  puts "\nТеперь можно коммитить и пушить на GitHub!"
end

# Запуск скрипта
main if __FILE__ == $0