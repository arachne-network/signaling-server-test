typedef struct connectionData {
    double bandwidth;
    double reliability;
} connectionData;

#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <cstring>

using namespace std;

const int MAXN = 100;
const int INF = INT_MAX;

struct Edge {
    int to, capacity, flow, rev;
};

class Graph {
public:
    vector<Edge> adj[MAXN];
    
    void addEdge(int u, int v, int capacity) {
        Edge a = {v, capacity, 0, (int)adj[v].size()};
        Edge b = {u, 0, 0, (int)adj[u].size()};
        adj[u].push_back(a);
        adj[v].push_back(b);
    }
    
    bool bfs(int source, int sink, vector<int>& level) {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        q.push(source);
        level[source] = 0;
        
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            
            for (const Edge& e : adj[u]) {
                if (level[e.to] < 0 && e.flow < e.capacity) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                    if (e.to == sink) return true;
                }
            }
        }
        return false;
    }
    
    int dfs(int u, int sink, int flow, vector<int>& level, vector<int>& start) {
        if (u == sink) return flow;
        
        for (int& i = start[u]; i < adj[u].size(); ++i) {
            Edge& e = adj[u][i];
            if (level[e.to] == level[u] + 1 && e.flow < e.capacity) {
                int currFlow = min(flow, e.capacity - e.flow);
                int tempFlow = dfs(e.to, sink, currFlow, level, start);
                
                if (tempFlow > 0) {
                    e.flow += tempFlow;
                    adj[e.to][e.rev].flow -= tempFlow;
                    return tempFlow;
                }
            }
        }
        return 0;
    }
    
    int dinic(int source, int sink) {
        int maxFlow = 0;
        vector<int> level(MAXN);
        vector<int> start(MAXN);
        
        while (bfs(source, sink, level)) {
            fill(start.begin(), start.end(), 0);
            while (int flow = dfs(source, sink, INF, level, start)) {
                maxFlow += flow;
            }
        }
        return maxFlow;
    }
};