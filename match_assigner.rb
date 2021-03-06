$LOAD_PATH << '.'

require 'match_solver'

class MatchAssigner

@@debug = false

def initialize(division, round)
  @division = division
  @round = round
end

def assign_matches()
  (players_to_play, extra_candidates) = @division.get_players_to_play(@round)
  if players_to_play.length == 0
    puts "No pending matches to play for any player" if @@debug
    return []
  end
  puts players_to_play if @@debug

  nrivals = players_to_play.length
  expected_rivals = 4*(nrivals/4.0).ceil()
  extra_rivals = expected_rivals - nrivals

  one2one = fill_basic_one2one(@division.players)
  matches = @division.get_all_matches()
  fill_one2one_with_matches(one2one, matches)

  best_score = 0
  best_solution = []
  best_one2one = []
  best_extra = []

  combinations = extra_candidates.combination(extra_rivals).to_a.shuffle
  for extra in combinations
    players_to_play_with_extra = players_to_play + extra
    puts "Testing solution with extra #{extra}"
    begin
      solver = Solver.new(one2one)
      solution, score, new_one2one = solver.solve(players_to_play_with_extra)
    rescue Exception => e
      puts "No valid solution could be achieved for these players"
      next
    end
    if score > best_score
      best_score = score
      best_solution = solution
      best_one2one = new_one2one
      best_extra = extra
      puts "Found new best solution with score #{score} and extra players #{best_extra}"
    else
      puts "No best solution (best score was #{score})"
    end
  end

  puts "The best solution has a score of #{best_score} with extra players #{best_extra}"
  return best_solution
end

def fill_basic_one2one(players)
  one2one = {}
  for p in players
    one2one[p.id] = {}
    for q in players - [p]
      one2one[p.id][q.id] = 0
    end
  end
  one2one
end

def fill_one2one_with_solution(one2one, solution)
  nmatches = solution.length / 4
  for m in 0...nmatches
    pl1 = solution[m*4]
    pl2 = solution[m*4+1]
    pl3 = solution[m*4+2]
    pl4 = solution[m*4+3]
    #puts "Analysing match with #{pl1}, #{pl2}, #{pl3}, #{pl4}"
    one2one[pl1][pl2] += 1
    one2one[pl1][pl3] += 1
    one2one[pl1][pl4] += 1
    one2one[pl2][pl1] += 1
    one2one[pl2][pl3] += 1
    one2one[pl2][pl4] += 1
    one2one[pl3][pl1] += 1
    one2one[pl3][pl2] += 1
    one2one[pl3][pl4] += 1
    one2one[pl4][pl1] += 1
    one2one[pl4][pl2] += 1
    one2one[pl4][pl3] += 1
  end
end

def fill_one2one_with_matches(one2one, matches)
  for m in matches
    solution = m.players
    fill_one2one_with_solution(one2one, solution)
  end
end

end
