import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BookOpen, Calendar, TrendingUp, Grid3x3, Music, Palette,
  Filter, Search, Plus, Edit, Trash2, Eye, MessageSquare, FileText, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/sidebar";
import { ArtifactViewer } from "@/components/artifact-viewer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Artifact } from "@shared/schema";

const artifactTypes = [
  { value: "bible_quiz", label: "Bible Quiz", icon: MessageSquare, color: "bg-blue-500" },
  { value: "verse_memorizer", label: "Verse Memorizer", icon: BookOpen, color: "bg-green-500" },
  { value: "prayer_journal", label: "Prayer Journal", icon: FileText, color: "bg-purple-500" },
  { value: "scripture_search", label: "Scripture Search", icon: Search, color: "bg-orange-500" },
  { value: "devotional_planner", label: "Devotional Planner", icon: Calendar, color: "bg-red-500" },
  { value: "bible_timeline", label: "Bible Timeline", icon: BarChart3, color: "bg-cyan-500" },
  { value: "sermon_notes", label: "Sermon Notes", icon: FileText, color: "bg-pink-500" },
  { value: "faith_tracker", label: "Faith Tracker", icon: TrendingUp, color: "bg-indigo-500" },
  { value: "biblical_crossword", label: "Biblical Crossword", icon: Grid3x3, color: "bg-yellow-500" },
  { value: "psalm_generator", label: "Psalm Generator", icon: Music, color: "bg-teal-500" },
  { value: "bible_study_guide", label: "Bible Study Guide", icon: BookOpen, color: "bg-emerald-500" },
  { value: "scripture_art", label: "Scripture Art", icon: Palette, color: "bg-rose-500" },
];

const sampleArtifacts = {
  'bible_quiz': {
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bible Quiz</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
    <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">📖 Bible Knowledge Quiz</h1>
            <p class="text-lg text-gray-600">Test your knowledge of God's Word</p>
        </div>
        
        <div id="quiz-container" class="bg-white rounded-lg shadow-lg p-8">
            <div id="question-container" class="mb-6">
                <h2 id="question" class="text-2xl font-semibold text-gray-800 mb-4"></h2>
                <div id="options" class="space-y-3"></div>
            </div>
            
            <div class="flex justify-between items-center">
                <div id="progress" class="text-sm text-gray-600"></div>
                <div id="score" class="text-sm font-semibold text-blue-600"></div>
            </div>
            
            <button id="next-btn" class="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors" style="display: none;">
                Next Question
            </button>
        </div>
    </div>
    
    <script>
        const questions = [
            {
                question: "Who was the first man created by God?",
                options: ["Adam", "Noah", "Abraham", "Moses"],
                correct: 0
            },
            {
                question: "How many days did it take God to create the world?",
                options: ["5 days", "6 days", "7 days", "8 days"],
                correct: 1
            },
            {
                question: "What did Jesus say was the greatest commandment?",
                options: ["Honor your parents", "Do not steal", "Love God with all your heart", "Do not lie"],
                correct: 2
            }
        ];
        
        let currentQuestion = 0;
        let score = 0;
        let answered = false;
        
        function loadQuestion() {
            const q = questions[currentQuestion];
            document.getElementById('question').textContent = q.question;
            document.getElementById('progress').textContent = \`Question \${currentQuestion + 1} of \${questions.length}\`;
            document.getElementById('score').textContent = \`Score: \${score}/\${questions.length}\`;
            
            const optionsContainer = document.getElementById('options');
            optionsContainer.innerHTML = '';
            
            q.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.className = 'w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors';
                button.onclick = () => selectAnswer(index);
                optionsContainer.appendChild(button);
            });
            
            document.getElementById('next-btn').style.display = 'none';
            answered = false;
        }
        
        function selectAnswer(selected) {
            if (answered) return;
            
            const q = questions[currentQuestion];
            const options = document.querySelectorAll('#options button');
            
            options.forEach((button, index) => {
                if (index === q.correct) {
                    button.className = 'w-full p-4 text-left bg-green-200 text-green-800 rounded-lg';
                } else if (index === selected && selected !== q.correct) {
                    button.className = 'w-full p-4 text-left bg-red-200 text-red-800 rounded-lg';
                } else {
                    button.className = 'w-full p-4 text-left bg-gray-100 rounded-lg';
                }
            });
            
            if (selected === q.correct) {
                score++;
                document.getElementById('score').textContent = \`Score: \${score}/\${questions.length}\`;
            }
            
            answered = true;
            document.getElementById('next-btn').style.display = 'block';
            
            if (currentQuestion === questions.length - 1) {
                document.getElementById('next-btn').textContent = 'See Results';
            }
        }
        
        function nextQuestion() {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                loadQuestion();
            }
        }
        
        document.getElementById('next-btn').addEventListener('click', nextQuestion);
        loadQuestion();
    </script>
</body>
</html>`,
    title: 'Bible Quiz'
  },
  'verse_memorizer': {
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verse Memorizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-6 bg-gradient-to-br from-green-50 to-blue-50">
    <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">🧠 Scripture Memory Helper</h1>
            <p class="text-lg text-gray-600">Hide the words and test your memory</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="mb-6">
                <select id="verseSelect" class="w-full p-3 border rounded-lg mb-4">
                    <option value="0">John 3:16</option>
                    <option value="1">Philippians 4:13</option>
                    <option value="2">Romans 8:28</option>
                </select>
                
                <div class="flex gap-4 mb-4">
                    <button onclick="showAll()" class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">Show All</button>
                    <button onclick="hideRandom()" class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Hide Random Words</button>
                    <button onclick="hideAll()" class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">Hide All</button>
                </div>
            </div>
            
            <div id="verse-container" class="text-xl leading-relaxed mb-6 p-6 bg-gray-50 rounded-lg">
                <div id="verse-text"></div>
                <div id="verse-reference" class="mt-4 text-lg font-semibold text-blue-600"></div>
            </div>
        </div>
    </div>
    
    <script>
        const verses = [
            {
                text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
                reference: "John 3:16"
            },
            {
                text: "I can do all this through him who gives me strength.",
                reference: "Philippians 4:13"
            },
            {
                text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
                reference: "Romans 8:28"
            }
        ];
        
        let currentVerse = 0;
        let hiddenWords = new Set();
        
        function loadVerse() {
            const verse = verses[currentVerse];
            document.getElementById('verse-reference').textContent = verse.reference;
            showAll();
        }
        
        function showAll() {
            hiddenWords.clear();
            displayVerse();
        }
        
        function hideRandom() {
            const verse = verses[currentVerse];
            const words = verse.text.split(' ');
            const numToHide = Math.ceil(words.length * 0.3);
            
            for (let i = 0; i < numToHide; i++) {
                const randomIndex = Math.floor(Math.random() * words.length);
                hiddenWords.add(randomIndex);
            }
            displayVerse();
        }
        
        function hideAll() {
            const verse = verses[currentVerse];
            const words = verse.text.split(' ');
            for (let i = 0; i < words.length; i++) {
                hiddenWords.add(i);
            }
            displayVerse();
        }
        
        function displayVerse() {
            const verse = verses[currentVerse];
            const words = verse.text.split(' ');
            
            const verseHtml = words.map((word, index) => {
                if (hiddenWords.has(index)) {
                    return \`<span class="text-transparent bg-gray-300 rounded px-1 cursor-pointer" onclick="revealWord(\${index})">\${word.replace(/[a-zA-Z]/g, '_')}</span>\`;
                } else {
                    return word;
                }
            }).join(' ');
            
            document.getElementById('verse-text').innerHTML = verseHtml;
        }
        
        function revealWord(index) {
            hiddenWords.delete(index);
            displayVerse();
        }
        
        document.getElementById('verseSelect').addEventListener('change', function() {
            currentVerse = parseInt(this.value);
            loadVerse();
        });
        
        loadVerse();
    </script>
</body>
</html>`,
    title: 'Verse Memorizer'
  },
  'prayer_journal': {
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prayer Journal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
    <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">🙏 Digital Prayer Journal</h1>
            <p class="text-lg text-gray-600">Record your prayers and see God's faithfulness</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-semibold mb-4">New Prayer Request</h2>
                <form id="prayer-form">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Prayer Request</label>
                        <textarea id="prayer-text" class="w-full p-3 border rounded-lg h-32" placeholder="Share your heart with God..."></textarea>
                    </div>
                    
                    <button type="submit" class="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700">
                        Add Prayer Request
                    </button>
                </form>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-semibold mb-4">Prayer History</h2>
                <div id="prayer-list" class="space-y-4 max-h-96 overflow-y-auto">
                    <!-- Prayers will be added here -->
                </div>
            </div>
        </div>
    </div>
    
    <script>
        let prayers = JSON.parse(localStorage.getItem('prayerJournal') || '[]');
        
        function savePrayers() {
            localStorage.setItem('prayerJournal', JSON.stringify(prayers));
        }
        
        function addPrayer(text) {
            const prayer = {
                id: Date.now(),
                text,
                date: new Date().toLocaleDateString(),
                answered: false
            };
            prayers.unshift(prayer);
            savePrayers();
            displayPrayers();
        }
        
        function displayPrayers() {
            const container = document.getElementById('prayer-list');
            
            if (prayers.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center">No prayers yet. Start your prayer journey!</p>';
                return;
            }
            
            container.innerHTML = prayers.map(prayer => \`
                <div class="border rounded-lg p-4 \${prayer.answered ? 'bg-green-50' : 'bg-gray-50'}">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-xs text-gray-500">\${prayer.date}</span>
                    </div>
                    <p class="text-gray-800 mb-2">\${prayer.text}</p>
                    \${prayer.answered ? '<p class="text-sm text-green-600 font-medium">Answered ✓</p>' : ''}
                </div>
            \`).join('');
        }
        
        document.getElementById('prayer-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const text = document.getElementById('prayer-text').value.trim();
            
            if (!text) {
                alert('Please enter a prayer request.');
                return;
            }
            
            addPrayer(text);
            document.getElementById('prayer-text').value = '';
        });
        
        displayPrayers();
    </script>
</body>
</html>`,
    title: 'Prayer Journal'
  }
};

// Sample artifact metadata for inspiration tab
const sampleArtifactMeta = [
  {
    type: 'bible_quiz',
    title: 'Bible Quiz',
    description: 'Interactive quiz to test biblical knowledge',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  {
    type: 'verse_memorizer',
    title: 'Verse Memorizer',
    description: 'Scripture memory training tool',
    icon: BookOpen,
    color: 'bg-green-500'
  },
  {
    type: 'prayer_journal',
    title: 'Prayer Journal',
    description: 'Digital prayer request tracker',
    icon: FileText,
    color: 'bg-purple-500'
  },
  {
    type: 'scripture_search',
    title: 'Scripture Search',
    description: 'Search and study Bible passages',
    icon: Search,
    color: 'bg-orange-500'
  },
  {
    type: 'devotional_planner',
    title: 'Devotional Planner',
    description: 'Plan and track daily devotions',
    icon: Calendar,
    color: 'bg-red-500'
  },
  {
    type: 'bible_timeline',
    title: 'Bible Timeline',
    description: 'Interactive biblical history timeline',
    icon: BarChart3,
    color: 'bg-cyan-500'
  },
  {
    type: 'sermon_notes',
    title: 'Sermon Notes',
    description: 'Take and organize sermon notes',
    icon: FileText,
    color: 'bg-pink-500'
  },
  {
    type: 'faith_tracker',
    title: 'Faith Tracker',
    description: 'Track spiritual growth journey',
    icon: TrendingUp,
    color: 'bg-indigo-500'
  },
  {
    type: 'biblical_crossword',
    title: 'Biblical Crossword',
    description: 'Bible-themed crossword puzzles',
    icon: Grid3x3,
    color: 'bg-yellow-500'
  },
  {
    type: 'psalm_generator',
    title: 'Psalm Generator',
    description: 'Create personalized psalms of praise',
    icon: Music,
    color: 'bg-teal-500'
  },
  {
    type: 'bible_study_guide',
    title: 'Bible Study Guide',
    description: 'Structured Bible study templates',
    icon: BookOpen,
    color: 'bg-emerald-500'
  },
  {
    type: 'scripture_art',
    title: 'Scripture Art',
    description: 'Create beautiful scripture artwork',
    icon: Palette,
    color: 'bg-rose-500'
  }
];

export default function ArtifactsPage() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedArtifact, setSelectedArtifact] = useState<{html: string, title: string, type?: string} | null>(null);
  const [showArtifactViewer, setShowArtifactViewer] = useState(false);
  const [activeTab, setActiveTab] = useState("inspiration");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch artifacts
  const { data: artifacts = [], isLoading } = useQuery({
    queryKey: ["/api/artifacts", filterType !== "all" ? filterType : undefined],
    queryFn: async () => {
      const url = `/api/artifacts${filterType !== "all" ? `?type=${filterType}` : ""}`;
      const response = await apiRequest("GET", url);
      return response.json();
    }
  });

  // Delete artifact mutation
  const deleteArtifact = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/artifacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts"] });
    }
  });



  const filteredArtifacts = artifacts.filter((artifact: Artifact) =>
    artifact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewArtifact = (artifact: Artifact) => {
    setSelectedArtifact({ 
      html: artifact.content, 
      title: artifact.title 
    });
    setShowArtifactViewer(true);
  };

  const handleDeleteArtifact = (id: number) => {
    if (confirm("Are you sure you want to delete this artifact?")) {
      deleteArtifact.mutate(id);
    }
  };

  const handleViewSampleArtifact = (type: string) => {
    const artifact = sampleArtifacts[type];
    if (artifact) {
      setSelectedArtifact({...artifact, type});
      setShowArtifactViewer(true);
    }
  };

  const handleCustomizeSampleArtifact = async (artifactData: {html: string, title: string, type: string}) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to customize artifacts.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const conversationData = {
        title: `Customize ${artifactData.title}`,
        type: "independent" as const,
        initialMessage: `I'd like to customize this ${artifactData.title} biblical tool. Can you help me modify it to better suit my spiritual growth needs?`,
        artifact: {
          title: artifactData.title,
          content: artifactData.html,
          type: artifactData.type
        }
      };
      
      const response = await apiRequest("POST", "/api/conversations", conversationData);
      const result = await response.json();
      const conversation = result.conversation; // Extract conversation from the response object
      
      // Invalidate conversations cache to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      
      // Prefetch the conversation to ensure it's ready when we navigate
      await queryClient.prefetchQuery({
        queryKey: ["/api/conversations", conversation.id],
        queryFn: async () => {
          const response = await apiRequest("GET", `/api/conversations/${conversation.id}`);
          return response.json();
        }
      });
      
      setShowArtifactViewer(false);
      setSelectedArtifact(null);
      setLocation(`/conversations/${conversation.id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTypeInfo = (type: string) => {
    return artifactTypes.find(t => t.value === type) || artifactTypes[0];
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Biblical Artifacts</h1>
            <p className="text-sm text-gray-600">Create and manage your spiritual growth tools</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
              <TabsTrigger value="my-artifacts">My Artifacts</TabsTrigger>
            </TabsList>

            <TabsContent value="inspiration" className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleArtifactMeta.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Card key={tool.type} className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${tool.color} text-white group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button 
                          onClick={() => handleViewSampleArtifact(tool.type)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview {tool.title}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="my-artifacts" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search artifacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {artifactTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading artifacts...</p>
                </div>
              ) : filteredArtifacts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No artifacts found. Create your first biblical tool!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtifacts.map((artifact: Artifact) => {
                    const typeInfo = getTypeInfo(artifact.type);
                    const IconComponent = typeInfo.icon;

                    return (
                      <Card key={artifact.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{artifact.title}</CardTitle>
                                <CardDescription>{artifact.description}</CardDescription>
                              </div>
                            </div>
                            <Badge variant="secondary">{typeInfo.label}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewArtifact(artifact)}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteArtifact(artifact.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showArtifactViewer && selectedArtifact && (
        <ArtifactViewer
          html={selectedArtifact.html}
          title={selectedArtifact.title}
          onClose={() => {
            setShowArtifactViewer(false);
            setSelectedArtifact(null);
          }}
          onCustomize={selectedArtifact.type && user ? () => handleCustomizeSampleArtifact(selectedArtifact as {html: string, title: string, type: string}) : undefined}
        />
      )}
    </div>
  );
}